import { Request, Response } from 'express';
import { AppointmentModel } from '../models/AppointmentModel';
import { BarberModel } from '../models/BarberModel';
import { ServiceModel } from '../models/ServiceModel';
import { TransactionModel } from '../models/TransactionModel'
import { DailyCashCloseModel } from '../models/DailyCashCloseModel';

export class AppointmentController {
    async create(req: Request, res: Response) {
        const { barbershop, startAt, serviceId, barberId } = req.body;

        if (!barbershop || !startAt || !serviceId || !barberId) {
            return res.status(400).json({
                message: 'barbershop, startAt, serviceId e barberId são obrigatórios'
            })
        }

        // Check if the barber exists
        const barber = await BarberModel.findById(barberId);
        if (!barber) {
            return res.status(404).json({ message: 'Barbeiro nao encontrado' });
        }

        // Check if the service exists
        const service = await ServiceModel.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Serviço nao encontrado' });
        };

        const startDate = new Date(startAt)
        const endAt = new Date(
            startDate.getTime() + service.durationMinutes * 60000
        )

        // Check conflicts
        const conflict = await AppointmentModel.findOne({
            barber: barberId,
            startAt: { $lt: endAt },
            endAt: { $gt: startDate }
        })

        if (conflict) {
            return res.status(409).json({ message: 'Horário indisponível para este barbeiro' });
        }

        // Create a new appointment
        const appointment = await AppointmentModel.create({
            barbershop,
            startAt,
            endAt,
            service: serviceId,
            barber: barberId
        });

        return res.status(201).json(appointment);
    }

    async list(req: Request, res: Response) {
        const barbershopId = req.headers['barbershop-id'];
        const appointments = await AppointmentModel.find({ barbershop: barbershopId }).populate('service');

        if (!appointments.length) {
            return res.status(404).json({ message: 'Agendamentos nao encontrados' });
        }

        return res.status(200).json(appointments);
    }

    async updateStatus(req: Request, res: Response) {
        const { id } = req.params
        const { barbershop, status } = req.body

        // Check if the appointment exists
        const appointment = await AppointmentModel
            .findOne({ barbershop, _id: id })
            .populate('service')
            .populate('barber')

        if (!appointment) {
            return res.status(404).json({ error: 'Agendamento nao encontrado' })
        }

        // Check if day is closed
        const start = new Date(appointment.startAt);
        const end = new Date(appointment.startAt);

        start.setUTCHours(0, 0, 0, 0);
        end.setUTCHours(23, 59, 59, 999);

        const dailyCashCloses = await DailyCashCloseModel.find({
            date: { $gte: start, $lte: end }
        });

        if (dailyCashCloses.length > 0) {
            return res.status(409).json({ message: 'Não é possível alterar o status de um agendamento em um dia já fechado' });
        }

        appointment.status = status
        await appointment.save()

        if (status === 'completed') {
            await TransactionModel.create({
                barbershop: barbershop,
                appointment: appointment._id,
                barber: appointment.barber,
                amount: (appointment.service as any).price,
                commissionPercent: (appointment.barber as any).commissionPercent
            })
        }

        return res.json(appointment)
    }

    async cancel(req: Request, res: Response) {
        const { id } = req.params;
        const barbershopId = req.headers['barbershop-id'];

        // Check if the appointment exists
        const appointment = await AppointmentModel.findOne({ barbershop: barbershopId, _id: id });
        if (!appointment) {
            return res.status(404).json({ message: 'Agendamento não encontrado' });
        }

        // Check if day is closed
        const start = new Date(appointment.startAt);
        const end = new Date(appointment.startAt);

        start.setUTCHours(0, 0, 0, 0);
        end.setUTCHours(23, 59, 59, 999);

        const dailyCashCloses = await DailyCashCloseModel.find({
            date: { $gte: start, $lte: end }
        });

        if (dailyCashCloses.length > 0) {
            return res.status(409).json({ message: 'Não é possível cancelar um agendamento em um dia já fechado' });
        }

        appointment.status = 'cancelled';
        await appointment.save();

        return res.status(200).json(appointment);
    }
}