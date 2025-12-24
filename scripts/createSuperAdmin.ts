import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import UserModel from '../src/modules/auth/models/UserModel';

async function createSuperAdmin() {
    await mongoose.connect(process.env.MONGO_URI as string);

    const email = 'superadmin@example.com';
    const password = '1596';;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        console.log('Super admin já cadastrado.');
        return;
    }

    const user = new UserModel({
        email,
        password: hashedPassword,
        roles: ['super-admin'],
        tenants: {}
    });

    await user.save();
    console.log('Super admin criado com sucesso.');
    mongoose.disconnect();
}

createSuperAdmin();