import { Schema, model, Types } from 'mongoose';

const DailyCashCloseSchema = new Schema(
    {
        barbershop: {
            type: Schema.Types.ObjectId,
            ref: 'Barbershop',
            required: true
        },
        date: {
            type: Date,
            required: true,
            unique: true
        },
        totalAmount: {
            type: Number,
            required: true
        },
        totalCommission: {
            type: Number,
            required: true
        },
        netAmount: {
            type: Number,
            required: true
        },
        byBarber: [
            {
                barber: {
                    type: Types.ObjectId,
                    ref: 'Barber',
                    required: true
                },
                totalAmount: Number,
                totalCommission: Number,
                netAmount: Number
            }
        ]
    },
    { timestamps: true }
);

export const DailyCashCloseModel = model('DailyCashClose', DailyCashCloseSchema);
