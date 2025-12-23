import { Schema, model, Types } from 'mongoose';

const AppointmentSchema = new Schema({
    barbershop: {
        type: Schema.Types.ObjectId,
        ref: 'Barbershop',
        required: true
    },
    startAt: {
        type: Date,
        required: true
    },
    endAt: {
        type: Date,
        required: true
    },
    service: {
        type: Types.ObjectId,
        ref: 'Service',
        required: true
    },
    barber: {
        type: Schema.Types.ObjectId,
        ref: 'Barber',
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled'
    },
}, { timestamps: true }
)

export const AppointmentModel = model('Appointment', AppointmentSchema);