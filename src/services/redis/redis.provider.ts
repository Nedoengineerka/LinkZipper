import { Provider } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import Redis from 'ioredis';
import redisConfig from 'src/configs/redis.config';

export type RedisClient = Redis;

export const RedisProvider: Provider = {
  useFactory: (configService: ConfigService): RedisClient => {
    const { redisUrl, port } =
      configService.get<ConfigType<typeof redisConfig>>('redis');
    return new Redis({
      host: redisUrl,
      port: port,
    });
  },
  provide: 'REDIS_CLIENT',
  inject: [ConfigService],
};
