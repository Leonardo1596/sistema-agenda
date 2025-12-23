import express from 'express'
import barbershopRoutes from './modules/barbershop/routes'

const app = express()

app.use(express.json())
app.use('/barbershop', barbershopRoutes);

export default app