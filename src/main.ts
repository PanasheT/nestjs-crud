import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import * as basicAuth from 'express-basic-auth';
import { AppModule } from './modules/app.module';
import { queryAPIdetails } from './util';

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
    .setTitle(queryAPIdetails('name'))
    .setDescription(queryAPIdetails('description'))
    .setVersion(queryAPIdetails('version'))
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { tagsSorter: 'alpha', operationsSorter: 'alpha' },
  });

  await app.listen(3000);
}
bootstrap();
