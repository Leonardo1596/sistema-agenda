import { Request, Response } from 'express';
import { BarberModel } from '../models/BarberModel';

export class BarberController {
    async create(req: Request, res: Response) {
        const barber = await BarberModel.create({
            ...req.body,
            barbershop: req.barbershopId
        });
        return res.status(201).json(barber);
    }

    async list(req: Request, res: Response) {
        const barbershopId = req.headers['barbershop-id'];
        const barbers = await BarberModel.find({ barbershop: barbershopId, active: true });

        if (!barbers.length) {
            return res.status(404).json({ message: 'Barbeiros nao encontrados' });
        }
        return res.status(200).json(barbers);
    }

    async disable(req: Request, res: Response) {
        const { id } = req.params;
        const barbershopId = req.headers['barbershop-id'];

        const barber = await BarberModel.findOne({ barbershop: barbershopId, _id: id });
        if (!barber) {
            return res.status(404).json({ message: 'Barbeiros nao encontrados' });
        }

        barber.active = false;
        await barber.save();

        return res.status(200).json({ message: 'Barbeiro desativado com sucesso' });
    }
}