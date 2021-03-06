import { TransformInterceptor } from './transform.interceptor';
import {
  BadRequestException,
  Logger,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('NestJS Backend Course')
    .setDescription('The tasks API description')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map((error) => {
          const messages = Object.values(error.constraints).map((val) => val);
          return {
            title: error.property,
            messages,
          };
        });

        return new BadRequestException(messages);
      },
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(3000);
  logger.log('Application listening on port 3000');
}
bootstrap();
