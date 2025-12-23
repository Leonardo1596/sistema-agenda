import 'dotenv/config';
import app from './app';
import { connectMongo } from './database/mongo';

const PORT = process.env.PORT || 8000;

async function bootstrap() {
  await connectMongo();

  app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
  })
}

bootstrap();