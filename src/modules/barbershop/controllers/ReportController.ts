import { Request, Response } from 'express';
import { TransactionModel } from '../models/TransactionModel'
import { DailyCashCloseModel } from '../models/DailyCashCloseModel';

interface BarberLean {
    _id: string
    name: string
    commissionPercent: number
}

interface TransactionLean {
    barber: BarberLean
    amount: number
    commissionPercent: number
}

export class ReportController {
    async daily(req: Request, res: Response) {
        const { date } = req.query;

        let startOfDay: Date;
        let endOfDay: Date;

        if (date) {
            const [year, month, day] = (date as string).split('-').map(Number);

            startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
            endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);
        } else {
            const now = new Date();
            startOfDay = new Date(now);
            startOfDay.setHours(0, 0, 0, 0);

            endOfDay = new Date(now);
            endOfDay.setHours(23, 59, 59, 999);
        }

        const transactions = await TransactionModel.find({
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        })
            .populate('barber')
            .lean<TransactionLean[]>();

        let totalAmount = 0;
        let totalCommission = 0;

        const byBarber: any[] = [];

        for (const transaction of transactions) {
            const amount = transaction.amount;
            const commission =
                (amount * transaction.commissionPercent) / 100;

            totalAmount += amount;
            totalCommission += commission;

            let barberReport = byBarber.find(
                b => b.barberId.toString() === transaction.barber._id.toString()
            );

            if (!barberReport) {
                barberReport = {
                    barberId: transaction.barber._id,
                    barberName: transaction.barber.name,
                    totalAmount: 0,
                    totalCommission: 0
                };
                byBarber.push(barberReport);
            }

            barberReport.totalAmount += amount;
            barberReport.totalCommission += commission;
        }

        return res.json({
            date: startOfDay.toISOString().slice(0, 10),
            totalAmount,
            totalCommission,
            netAmount: totalAmount - totalCommission,
            appointments: transactions.length,
            byBarber
        });
    }

    async monthly(req: Request, res: Response) {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({ error: 'Mês e ano são obrigatórios' });
        }

        const startOfMonth = new Date(Number(year), Number(month) - 1, 1, 0, 0, 0, 0);
        const endOfMonth = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);

        const closes = await DailyCashCloseModel.find({
            date: { $gte: startOfMonth, $lte: endOfMonth }
        }).populate('byBarber.barber')
            .lean() as any[]

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
                        barberId: b.barber._id,
                        barberName: b.barber.name,
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

        return res.json({
            year: Number(year),
            month: Number(month),
            daysCloses: closes.length,
            totalAmount,
            totalCommission,
            netAmount,
            byBarber: Array.from(byBarberMap.values())
        })
    }
}