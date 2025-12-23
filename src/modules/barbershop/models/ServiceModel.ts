import { Schema, model } from "mongoose";

const ServiceSchema = new Schema({
  barbershop: {
    type: Schema.Types.ObjectId,
    ref: 'Barbershop',
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  durationMinutes: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export const ServiceModel = model("Service", ServiceSchema);