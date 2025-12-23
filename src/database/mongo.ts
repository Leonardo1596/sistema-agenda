import mongoose from 'mongoose'

export async function connectMongo() {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log('Connected to MongoDB');
}