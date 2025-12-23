import { Request, Response } from 'express';
import { AppointmentModel } from '../models/AppointmentModel';

export class AvailabilityController {
    async list(req: Request, res: Response) {
        const { barberId, date } = req.query;

        if (!barberId || !date) {
            return res.status(400).json({ message: 'barberId e date são obrigatórios' });
        }

        const startAt = new Date(`${date}T00:00:00.000Z`);
        const endAt = new Date(`${date}T23:59:59.999Z`);

        const appointments = await AppointmentModel.find({
            barber: barberId,
            startAt: { $gte: startAt, $lte: endAt },
            status: 'scheduled'
        });

        // Barbershop working hours
        const OPEN_HOUR = 9;
        const CLOSE_HOUR = 18;
        const SLOT_MINUTES = 30;

        const slots: string[] = [];
        for (let hour = OPEN_HOUR; hour < CLOSE_HOUR; hour++) {
            for (let min = 0; min < 60; min += SLOT_MINUTES) {
                const slotStart = new Date(`${date}T${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}:00.000Z`)
                const slotEnd = new Date(slotStart.getTime() + SLOT_MINUTES * 60000)

                const hasConflict = appointments.some(app =>
                    slotStart < app.endAt && slotEnd > app.startAt
                )

                if (!hasConflict) {
                    slots.push(
                        `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`
                    )
                }
            }
        }
        return res.json({ slots });
    }
}