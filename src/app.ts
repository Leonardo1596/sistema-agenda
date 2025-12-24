import express from 'express';
import barbershopRoutes from './modules/barbershop/routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './modules/users/routes';

const app = express()

app.use(express.json())
app.use('/barbershop', barbershopRoutes);
app.use(authRoutes);
app.use(userRoutes);

export default app