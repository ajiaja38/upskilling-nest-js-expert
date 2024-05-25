import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyHelmet from '@fastify/helmet';

async function bootstrap() {
  const port: string | number = process.env.PORT || 3000;
  const globalPrefix: string = '/api/v1';

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.register(fastifyHelmet, {
    contentSecurityPolicy: false,
    xssFilter: true,
  });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(globalPrefix);
  await app.listen(port, '0.0.0.0');
  Logger.log(
    `🚀 Application listening on http://0.0.0.0:${port}${globalPrefix}`,
  );
}
bootstrap();
