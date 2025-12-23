import { Schema, model, Types } from 'mongoose';

const MonthlyCashCloseSchema = new Schema(
    {
        barbershop: {
            type: Schema.Types.ObjectId,
            ref: 'Barbershop',
            required: true
        },
        year: { type: Number, required: true },
        month: { type: Number, required: true },
        daysClosed: { type: Number, required: true },
        totalAmount: Number,
        totalCommission: Number,
        netAmount: Number,

        byBarber: [
            {
                barber: { type: Types.ObjectId, ref: 'Barber' },
                totalAmount: Number,
                totalCommission: Number,
                netAmount: Number
            }
        ]
    },
    { timestamps: true }
);

MonthlyCashCloseSchema.index({ year: 1, month: 1 }, { unique: true });

export const MonthlyCashCloseModel =
    model('MonthlyCashClose', MonthlyCashCloseSchema);