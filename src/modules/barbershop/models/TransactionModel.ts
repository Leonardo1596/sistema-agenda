import { Schema, model, Types } from "mongoose";

const TransactionSchema = new Schema({
    barbershop: {
        type: Schema.Types.ObjectId,
        ref: 'Barbershop',
        required: true
    },
    appointment: {
        type: Types.ObjectId,
        ref: "Appointment",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    barber: {
        type: Schema.Types.ObjectId,
        ref: 'Barber',
        required: true
    },
    commissionPercent: {
        type: Number,
        default: 50
    }
}, { timestamps: true });

export const TransactionModel = model("Transaction", TransactionSchema);