import { Schema, model, Document } from 'mongoose';
import { create } from 'node:domain';

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: {
        type: [String],
        enum: ['super-admin', 'user', 'admin', 'moderator'],
        default: ['user'],
    },
    tenants: {
        type: Map,
        of: [String],
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

export interface IUser extends Document {
  email: string;
  password: string;
  roles: string[];
  tenants: Record<string, string[]>;
  createdAt: Date;
  updatedAt: Date;
}

const UserModel = model<IUser>('User', UserSchema);

export default UserModel;