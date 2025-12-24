import { Request, Response } from 'express';
import { ServiceModel } from '../models/ServiceModel';

export class ServiceController {
    // Create a new service
    async create(req: Request, res: Response) {
        const service = await ServiceModel.create({
            ...req.body,
            barbershop: req.barbershopId
        });
        return res.status(201).json(service);
    }

    // List all services
    async list(req: Request, res: Response) {
        const services = await ServiceModel.find({ barbershop: req.barbershopId });

        if (!services.length) {
            return res.status(404).json({ message: 'Serviços nao encontrados' });
        }
        
        return res.status(200).json(services);
    }
}