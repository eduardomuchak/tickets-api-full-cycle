import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const { APP_PORT } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('===== Starting app =====');
  await app.listen(APP_PORT || 3000);
  console.log(`===== App started, listening on port ${APP_PORT || 3000} =====`);
}
bootstrap();
