import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnhandledExceptionFilter } from './common/filters/unhandled-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalFilters(new UnhandledExceptionFilter(httpAdapterHost));
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
