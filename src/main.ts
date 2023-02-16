import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import * as basicAuth from 'express-basic-auth';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use(
    ['/api', '/api-json'],
    basicAuth({
      challenge: true,
      users: {
        ['changeme']: 'changeme',
      },
    })
  );

  const config = new DocumentBuilder()
    .setTitle('nest_crud')
    .setDescription(
      'A simple CRUD (Create, Read, Update, Delete) application built with NestJS and TypeORM.'
    )
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { tagsSorter: 'alpha', operationsSorter: 'alpha' },
  });

  await app.listen(3000);
}
bootstrap();
