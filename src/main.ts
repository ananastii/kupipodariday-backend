import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnhandledExceptionFilter } from './common/filters/unhandled-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('server.port');
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalFilters(new UnhandledExceptionFilter(httpAdapterHost));
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
}
bootstrap();
