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

  async findByValue(value: string): Promise<RedisKey | null> {
    let cursor = '0';
    do {
      const [newCursor, keys] = await this.redisClient.scan(
        cursor,
        'MATCH',
        '*',
        'COUNT',
        100,
      );
      cursor = newCursor;
      for (const key of keys) {
        const storedValue = await this.redisClient.get(key);

        if (storedValue === value) {
          return key;
        }
      }
    } while (cursor !== '0');
    return null;
  }
}
