import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000; // Usa el puerto definido en .env o 3000 por defecto
  await app.listen(PORT);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
}
bootstrap();
