import { Injectable } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { RedisService } from './services/redis/redis.service';
import { RedisKey } from 'ioredis';
import { ShortenerService } from './services/shortener.service';

@Injectable()
export class AppService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
    private readonly shortenerService: ShortenerService,
  ) {}
  getStart(): string {
    return 'Welcome to LinkZipper!\nSend a link to /shorten to shorten it or a shortened link to /original to get the original link.';
  }

  async shortenerURL(originalURL: string): Promise<RedisKey | null> {
    try {
      // Check if the url has already been saved
      const cashedURLRedis = await this.redisService.findByValue(originalURL);
      if (cashedURLRedis) return cashedURLRedis;

      const savedURL = await this.prismaService.uRL.findUnique({
        where: {
          originalURL,
        },
      });
      if (savedURL) return savedURL.shortURL;

      // URL shortening
      const shortURL: RedisKey = this.shortenerService.shortenURL(originalURL);

      // Saving to Postgres and Redis
      await this.prismaService.uRL.create({
        data: {
          shortURL,
          originalURL,
        },
      });
      await this.redisService.set(shortURL, originalURL);

      return shortURL;
    } catch (err) {
      throw err;
    }
  }
}
