import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import UserModel from '../models/UserModel'
import { signToken } from '../../../shared/jwt'

export class AuthController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' })
    }

    const user = await UserModel.findOne({ email })

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const token = signToken({
      userId: user._id,
      roles: user.roles,
      tenants: user.tenants,
    })

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        roles: user.roles,
        tenants: user.tenants,
      },
    })
  }
}
