import { Request, Response } from 'express';
import { TransactionModel } from '../models/TransactionModel';
import { DailyCashCloseModel } from '../models/DailyCashCloseModel';
import { MonthlyCashCloseModel } from '../models/MonthlyCashClose';

export class CashCloseController {
    async closeDay(req: Request, res: Response) {
        const { date } = req.body;

        if (!date) {
            return res.status(400).json({ message: 'date é obrigatório' });
        }

        const [year, month, day] = date.split('-').map(Number);

        const startOfDay = new Date(year, month - 1, day, 0, 0, 0);
        const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

        // avoid closing twice
        const alreadyClosed = await DailyCashCloseModel.findOne({
            date: startOfDay
        });

        if (alreadyClosed) {
            return res
                .status(409)
                .json({ message: 'Caixa deste dia já foi fechado' });
        }

        const transactions = await TransactionModel.find({
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        }).populate('barber');

        let totalAmount = 0;
        let totalCommission = 0;

        const byBarberMap = new Map<string, any>();

        for (const t of transactions) {
            const amount = t.amount;
            const commission = (amount * t.commissionPercent) / 100;

            totalAmount += amount;
            totalCommission += commission;

            const barberId = t.barber._id.toString();

            if (!byBarberMap.has(barberId)) {
                byBarberMap.set(barberId, {
                    barber: t.barber._id,
                    totalAmount: 0,
                    totalCommission: 0,
                    netAmount: 0
                });
            }

            const barberData = byBarberMap.get(barberId);
            barberData.totalAmount += amount;
            barberData.totalCommission += commission;
            barberData.netAmount += amount - commission;
        }

        const cashClose = await DailyCashCloseModel.create({
            date: startOfDay,
            totalAmount,
            totalCommission,
            netAmount: totalAmount - totalCommission,
            byBarber: Array.from(byBarberMap.values())
        });

        return res.status(201).json(cashClose);
    }

    async closeMonth(req: Request, res: Response) {
        const { month, year } = req.body;

        const startOfMonth = new Date(year, month - 1, 1, 0, 0, 0);
        const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

        // avoid closing twice
        const alreadyClosed = await MonthlyCashCloseModel.findOne({
            year,
            month
        });

        if (alreadyClosed) {
            return res
                .status(409)
                .json({ message: 'Caixa deste mês já foi fechado' });
        }

        const closes = await DailyCashCloseModel.find({
            date: { $gte: startOfMonth, $lte: endOfMonth }
        }).populate('byBarber.barber')

        if (!closes.length) {
            return res
                .status(400)
                .json({ message: 'Nenhum fechamento diário encontrado para o mês' });
        }

        let totalAmount = 0;
        let totalCommission = 0;
        let netAmount = 0;

        const byBarberMap = new Map<string, any>();

        for (const close of closes) {
            totalAmount += close.totalAmount;
            totalCommission += close.totalCommission;
            netAmount += close.netAmount;

            for (const b of close.byBarber) {
                const barberId = b.barber._id.toString();

                if (!byBarberMap.has(barberId)) {
                    byBarberMap.set(barberId, {
                        barber: b.barber._id,
                        totalAmount: 0,
                        totalCommission: 0,
                        netAmount: 0
                    });
                }

                const barberData = byBarberMap.get(barberId);
                barberData.totalAmount += b.totalAmount;
                barberData.totalCommission += b.totalCommission;
                barberData.netAmount += b.netAmount;
            }
        }

        const monthlyClose = await MonthlyCashCloseModel.create({
            year,
            month,
            daysClosed: closes.length,
            totalAmount,
            totalCommission,
            netAmount,
            byBarber: Array.from(byBarberMap.values())
        });

        return res.status(201).json(monthlyClose);
    }

    async getMonthly(req: Request, res: Response) {
        const { year, month } = req.params;

        const monthlyClose = await MonthlyCashCloseModel.findOne({
            month: Number(month),
            year: Number(year)
        }).populate('byBarber.barber');

        if (!monthlyClose) {
            return res
                .status(404)
                .json({ message: 'Mês não fechado' });
        }

        return res.json(monthlyClose);
    }
}