import { Injectable } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { ShortenerService } from './services/shortener.service';
import { CacheService } from './services/cache.service';

@Injectable()
export class AppService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cacheService: CacheService,
    private readonly shortenerService: ShortenerService,
  ) {}

  async shortenUrl(originalUrl: string): Promise<string> {
    const cachedUrl = await this.cacheService.get(originalUrl);
    if (cachedUrl) return cachedUrl;

    const savedUrl = await this.prismaService.url.findUnique({
      where: {
        originalUrl,
      },
    });
    if (savedUrl) {
      this.cacheService.set(savedUrl.shortUrl, originalUrl);
      return savedUrl.shortUrl;
    }

    const shortUrl = await this.shortenerService.shortenUrl();

    await this.prismaService.url.upsert({
      create: {
        shortUrl,
        originalUrl,
      },
      where: { originalUrl },
      update: {},
    });
    this.cacheService.set(shortUrl, originalUrl);

    return shortUrl;
  }

  async getOriginalUrl(shortUrl: string): Promise<string | null> {
    const originalUrlRedis = await this.cacheService.get(shortUrl);
    if (originalUrlRedis) return originalUrlRedis;

    const originalUrl_DB = await this.prismaService.url.findUnique({
      where: {
        shortUrl,
      },
    });
    if (originalUrl_DB) {
      this.cacheService.set(
        originalUrl_DB.shortUrl,
        originalUrl_DB.originalUrl,
      );
      return originalUrl_DB.shortUrl;
    }
    return null;
  }
}
