import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // Optional: adds a prefix to the URL path
  }); // Serve files from the uploads directory
  app.enableCors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
