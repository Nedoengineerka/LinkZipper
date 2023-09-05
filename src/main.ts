import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService, ConfigType } from '@nestjs/config';
import nodeConfig from './configs/node.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const { port } = configService.get<ConfigType<typeof nodeConfig>>('node');
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
}
bootstrap();
