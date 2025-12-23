import { Schema, model, Types } from 'mongoose';

const BarbershopSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },
    ownerEmail: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true
})

export const BarbershopModel = model('Barbershop', BarbershopSchema);