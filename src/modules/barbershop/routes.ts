import { Router } from 'express';
import { resolveTenant } from './middlewares/Tenant';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { roleMiddleware } from '../../middlewares/roleMiddleware';
import { ServiceController } from './controllers/ServiceController';
import { AppointmentController } from './controllers/AppointmentController';
import { TransactionController } from './controllers/TransactionController';
import { BarbershopController } from './controllers/BarbershopController';
import { BarberController } from './controllers/BarberController';
import { AvailabilityController } from './controllers/AvailabilityController';
import { ReportController } from './controllers/ReportController';
import { CashCloseController } from './controllers/CashCloseController';

const router = Router();

// Barbershop
const barbershopController = new BarbershopController();
router.post('/barbershops', authMiddleware, roleMiddleware(['super-admin']), barbershopController.create);
router.get('/barbershops', barbershopController.list);

router.use(resolveTenant);

// services
const serviceController = new ServiceController();
router.post('/services', authMiddleware, roleMiddleware(['admin']), serviceController.create);
router.get('/services', authMiddleware, roleMiddleware(['admin', 'moderator']), serviceController.list);

// appointments
const appointmentController = new AppointmentController();
router.post('/appointments', authMiddleware, roleMiddleware(['admin', 'moderator']), appointmentController.create);
router.get('/appointments', authMiddleware, roleMiddleware(['admin', 'moderator']), appointmentController.list);
router.put('/appointments/:id/status', authMiddleware, roleMiddleware(['admin', 'moderator']), appointmentController.updateStatus);
router.put('/appointments/:id/cancel', authMiddleware, roleMiddleware(['admin', 'moderator']), appointmentController.cancel);

// transactions
const transactionController = new TransactionController();
router.get('/transactions', authMiddleware, roleMiddleware(['admin']), transactionController.list);

// barber
const barberController = new BarberController();
router.post('/barbers', authMiddleware, roleMiddleware(['admin']), barberController.create);
router.get('/barbers', authMiddleware, roleMiddleware(['admin', 'moderator']), barberController.list);
router.put('/barbers/:id/disable', authMiddleware, roleMiddleware(['admin']), barberController.disable);

// availability
const availabilityController = new AvailabilityController();
router.get('/availability', authMiddleware, roleMiddleware(['admin', 'moderator']), availabilityController.list);

// report
const reportController = new ReportController();
const cashCloseController = new CashCloseController();
router.get('/reports/daily', authMiddleware, roleMiddleware(['admin']), reportController.daily);
router.post('/reports/close-day', authMiddleware, roleMiddleware(['admin']), cashCloseController.closeDay);
router.post('/reports/close-month', authMiddleware, roleMiddleware(['admin']), cashCloseController.closeMonth);
router.post('/reports/monthly', authMiddleware, roleMiddleware(['admin']), reportController.monthly);
router.get('/reports/get-monthly-closed/:year/:month',  authMiddleware, roleMiddleware(['admin']), cashCloseController.getMonthly);



export default router;