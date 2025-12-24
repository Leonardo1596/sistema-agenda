// middlewares/resolveTenant.ts
import { Request, Response, NextFunction } from 'express'
import { Types } from 'mongoose'
import { BarbershopModel } from '../models/BarbershopModel'

declare global {
    namespace Express {
        interface Request {
            barbershopId?: Types.ObjectId
        }
    }
}

export async function resolveTenant(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const barbershopId = req.headers['barbershop-id'] as string

    if (!barbershopId) {
        return res.status(400).json({ error: 'barbershop-id é obrigatório' })
    }

    if (!Types.ObjectId.isValid(barbershopId)) {
        return res.status(400).json({ error: 'barbershop-id inválido' })
    }

    const barbershop = await BarbershopModel.findOne({ _id: barbershopId })
    if (!barbershop) {
        return res.status(404).json({ error: 'Barbershop nao encontrado' })
    }

    req.barbershopId = new Types.ObjectId(barbershopId)
    next()
}
