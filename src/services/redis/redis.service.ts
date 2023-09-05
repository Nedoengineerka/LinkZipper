import { Inject, Injectable } from '@nestjs/common';
import { RedisClient } from './redis.provider';
import { RedisKey } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClient,
  ) {}

  async set(key: RedisKey, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }

  async get(key: RedisKey): Promise<string | null> {
    return await this.redisClient.get(key);
  }
}
