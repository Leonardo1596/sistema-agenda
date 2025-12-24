import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import UserModel from '../../auth/models/UserModel';

export class UserController {
  async createAdmin(req: Request, res: Response) {
    const { email, password, barbershopId } = req.body

    if (!email || !password || !barbershopId) {
      return res.status(400).json({
        error: 'Email, senha e barbershopId são obrigatórios'
      })
    }

    const userExists = await UserModel.findOne({ email })

    if (userExists) {
      return res.status(409).json({ error: 'Usuário já existe' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await UserModel.create({
      email,
      password: hashedPassword,
      roles: ['admin'],
      tenants: {
        barbershop: [barbershopId]
      }
    })

    return res.status(201).json({
      id: user._id,
      email: user.email,
      roles: user.roles,
      tenants: user.tenants
    })
  }

  async createModerator(req: Request, res: Response) {
    const { email, password, barbershopId } = req.body

    if (!email || !password || !barbershopId) {
      return res.status(400).json({
        error: 'Email, senha e barbershopId são obrigatórios'
      })
    }

    const userExists = await UserModel.findOne({ email })

    if (userExists) {
      return res.status(409).json({ error: 'Usuário já existe' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await UserModel.create({
      email,
      password: hashedPassword,
      roles: ['moderator'],
      tenants: {
        barbershop: [barbershopId]
      }
    })

    return res.status(201).json({
      id: user._id,
      email: user.email,
      roles: user.roles,
      tenants: user.tenants
    })
  }
}
