import { Schema, model, Types } from 'mongoose';

const BarberSchema = new Schema({
    barbershop: {
        type: Schema.Types.ObjectId,
        ref: 'Barbershop',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    commissionPercent: {
        type: Number,
        default: 50
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true }
)

export const BarberModel = model('Barber', BarberSchema);