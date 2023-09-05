import { Injectable } from '@nestjs/common';
import { RedisService } from './redis/redis.service';

@Injectable()
export class CacheService {
  constructor(private readonly redisService: RedisService) {}

  async get(url: string): Promise<string> {
    return await this.redisService.get(url);
  }

  set(shortUrl: string, originalUrl: string): void {
    this.redisService.set(shortUrl, originalUrl);
    this.redisService.set(originalUrl, shortUrl);
  }
}
