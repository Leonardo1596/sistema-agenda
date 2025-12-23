import { Router } from 'express';
import { ServiceController } from './controllers/ServiceController';
import { AppointmentController } from './controllers/AppointmentController';
import { TransactionController } from './controllers/TransactionController';
import { BarbershopController } from './controllers/BarbershopController';
import { BarberController } from './controllers/BarberController';
import { AvailabilityController } from './controllers/AvailabilityController';
import { ReportController } from './controllers/ReportController';
import { CashCloseController } from './controllers/CashCloseController';

const router = Router();

// services
const serviceController = new ServiceController();
router.post('/services', serviceController.create);
router.get('/services', serviceController.list);

// appointments
const appointmentController = new AppointmentController();
router.post('/appointments', appointmentController.create);
router.get('/appointments', appointmentController.list);
router.put('/appointments/:id/status', appointmentController.updateStatus);
router.put('/appointments/:id/cancel', appointmentController.cancel);

// transactions
const transactionController = new TransactionController();
router.get('/transactions', transactionController.list);

// Barbershop
const barbershopController = new BarbershopController();
router.post('/barbershops', barbershopController.create);
router.get('/barbershops', barbershopController.list);

// barber
const barberController = new BarberController();
router.post('/barbers', barberController.create);
router.get('/barbers', barberController.list);
router.put('/barbers/:id/disable', barberController.disable);

// availability
const availabilityController = new AvailabilityController();
router.get('/availability', availabilityController.list);

// report
const reportController = new ReportController();
const cashCloseController = new CashCloseController();
router.get('/reports/daily', reportController.daily);
router.post('/reports/close-day', cashCloseController.closeDay);
router.post('/reports/close-month', cashCloseController.closeMonth);
router.post('/reports/monthly', reportController.monthly);
router.get('/reports/get-monthly-closed/:year/:month', cashCloseController.getMonthly);

export default router;