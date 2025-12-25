import { Router } from 'express'
import { UserController } from './controllers/UserController'
import { authMiddleware } from '../../middlewares/authMiddleware';
import { roleMiddleware } from '../../middlewares/roleMiddleware';

const routes = Router()
const userController = new UserController()

// 🔒 SOMENTE SUPER-ADMIN pode criar admin de barbearia
routes.post(
  '/users/create-admin',
  authMiddleware,
  roleMiddleware(['super-admin']),
  userController.createAdmin
)

// 🔒 ADMIN pode criar moderador
routes.post(
  '/users/create-moderator',
  authMiddleware,
  roleMiddleware(['admin']),
  userController.createModerator
)

export default routes
