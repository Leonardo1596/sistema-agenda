import express from 'express';
import cors from 'cors'
import barbershopRoutes from './modules/barbershop/routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './modules/users/routes';

const app = express()

app.use(express.json())
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID'],
}))
app.use('/barbershop', barbershopRoutes);
app.use(authRoutes);
app.use(userRoutes);

export default app