import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
      await this.prismaService.uRL.upsert({
        create: {
          shortURL,
          originalURL,
        },
        where: { originalURL },
        update: {},
      });
      await this.redisService.set(shortURL, originalURL);

      return shortURL;
    } catch (err) {
      throw err;
    }
  }

  async getOriginalURL(shortURL: string): Promise<string | null> {
    try {
      // Check if the url has already been saved
      const originalURLRedis = await this.redisService.get(shortURL);
      if (originalURLRedis) return originalURLRedis;

      const originalURL_DB = await this.prismaService.uRL.findUnique({
        where: {
          shortURL,
        },
      });
      if (originalURL_DB) return originalURL_DB.shortURL;

      throw new HttpException(
        `The url ${shortURL} does not exist.`,
        HttpStatus.NOT_FOUND,
      );
    } catch (err) {
      throw err;
    }
  }
}
