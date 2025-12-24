import { Router } from 'express'
import { AuthController } from '../modules/auth/controllers/AuthController';

const authRoutes = Router()
const authController = new AuthController()

authRoutes.post('/login', authController.login)

export default authRoutes
