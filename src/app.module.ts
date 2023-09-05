import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from './services/prisma.service';
import { RedisService } from './services/redis/redis.service';
import nodeConfig from './configs/node.config';
import { RedisProvider } from './services/redis/redis.provider';
import { ShortenerService } from './services/shortener.service';
import { CacheService } from './services/cache.service';
import redisConfig from './configs/redis.config';
import hostConfig from './configs/host.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      load: [nodeConfig, redisConfig, hostConfig],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService,
    PrismaService,
    RedisService,
    RedisProvider,
    ShortenerService,
    CacheService,
  ],
})
export class AppModule {}
