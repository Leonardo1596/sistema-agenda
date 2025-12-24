import { Request, Response } from 'express'
import { TransactionModel } from '../models/TransactionModel'
import { AppointmentModel } from '../models/AppointmentModel'

export class TransactionController {
    async list(req: Request, res: Response) {
        const transactions = await TransactionModel.find({ barbershop: req.barbershopId }).populate({
            path: 'appointment',
            populate: [
                { path: 'service' },
                { path: 'barber' }
            ]
        })

        if (!transactions.length) {
            return res.status(404).json({ message: 'Transações nao encontradas' });
        }
        return res.status(200).json(transactions)
    }
};