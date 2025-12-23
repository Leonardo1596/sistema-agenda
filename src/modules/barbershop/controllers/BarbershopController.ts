import { Request, Response } from 'express';
import { BarbershopModel } from '../models/BarbershopModel';

export class BarbershopController {
    async create(req: Request, res: Response) {
        if (!req.body.name) {
            return res.status(400).json({ error: 'Nome é obrigatório' });
        }

        const barbershop = await BarbershopModel.create(req.body);
        return res.status(201).json(barbershop);
    }

    async list(req: Request, res: Response) {
        const barbershops = await BarbershopModel.find();
        return res.json(barbershops);
    }
}