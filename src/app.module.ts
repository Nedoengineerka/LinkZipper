import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from './services/prisma.service';
import { RedisService } from './services/redis/redis.service';
import nodeConfig from './configs/node.config';
import { RedisProvider } from './services/redis/redis.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      load: [nodeConfig],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService,
    PrismaService,
    RedisService,
    RedisProvider,
  ],
})
export class AppModule {}
