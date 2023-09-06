/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AppService } from '../app.service';
import hostConfig from '../configs/host.config';
import nodeConfig from '../configs/node.config';
import redisConfig from '../configs/redis.config';
import { CacheService } from '../services/cache.service';
import { PrismaService } from '../services/prisma.service';
import { RedisService } from '../services/redis/redis.service';
import { ShortenerService } from '../services/shortener.service';
import RedisMock from 'ioredis-mock';
import { Redis } from 'ioredis';

describe('AppService', () => {
  let appService: AppService;
  let configService: ConfigService;
  let prismaService: PrismaService;
  let redisService: RedisService;
  let shortenerService: ShortenerService;
  let cacheService: CacheService;
  let redisMock: Redis;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          expandVariables: true,
          load: [nodeConfig, redisConfig, hostConfig],
        }),
      ],
      providers: [
        AppService,
        ConfigService,
        PrismaService,
        RedisService,
        {
          provide: 'REDIS_CLIENT',
          useValue: new RedisMock(),
        },
        ShortenerService,
        CacheService,
      ],
    }).compile();
    appService = moduleRef.get<AppService>(AppService);
    configService = moduleRef.get<ConfigService>(ConfigService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
    redisService = moduleRef.get<RedisService>(RedisService);
    redisMock = moduleRef.get('REDIS_CLIENT');
    shortenerService = moduleRef.get<ShortenerService>(ShortenerService);
    cacheService = moduleRef.get<CacheService>(CacheService);
  });

  describe('shortenUrl', () => {
    beforeEach(async () => {
      await redisMock.flushall();

      await redisMock.set(
        'twitch.com',
        'https://linkzipper.com/202NJ5eaZTylbJtb9Dji7t',
      );
      await redisMock.set(
        'https://linkzipper.com/202NJ5eaZTylbJtb9Dji7t',
        'twitch.com',
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return cached short URL', async () => {
      const prismaFindUniqueSpy = jest.spyOn(prismaService.url, 'findUnique');

      expect(await appService.shortenUrl('twitch.com')).toEqual(
        'https://linkzipper.com/202NJ5eaZTylbJtb9Dji7t',
      );
      expect(prismaFindUniqueSpy).not.toHaveBeenCalled();
    });

    it('should return a short URL from the database if it does not exist in the cache', async () => {
      const cachedGetSpy = jest
        .spyOn(cacheService, 'get')
        .mockResolvedValue(null);
      const prismaFindUniqueSpy = jest
        .spyOn(prismaService.url, 'findUnique')
        .mockResolvedValue({
          originalUrl: 'twitch.com',
          shortUrl: 'https://linkzipper.com/202NJ5eaZTylbJtb9Dji7t',
        });
      const shortenUrlSpy = jest.spyOn(shortenerService, 'shortenUrl');

      expect(await appService.shortenUrl('twitch.com')).toEqual(
        'https://linkzipper.com/202NJ5eaZTylbJtb9Dji7t',
      );
      expect(prismaFindUniqueSpy).toHaveBeenCalled();
      expect(shortenUrlSpy).not.toHaveBeenCalled();
    });

    it('should return a short URL after it is created, written to the database and cached', async () => {
      const cachedGetSpy = jest
        .spyOn(cacheService, 'get')
        .mockResolvedValue(null);
      const cachedSetSpy = jest.spyOn(cacheService, 'set');
      const prismaFindUniqueSpy = jest
        .spyOn(prismaService.url, 'findUnique')
        .mockResolvedValue(null);
      const shortenUrlSpy = jest
        .spyOn(shortenerService, 'shortenUrl')
        .mockResolvedValue('https://linkzipper.com/3QhrPi3mRhcoS7P2iYmwZM');
      const prismaUpsertSpy = jest
        .spyOn(prismaService.url, 'upsert')
        .mockResolvedValue({
          originalUrl: 'youtube.com',
          shortUrl: 'https://linkzipper.com/3QhrPi3mRhcoS7P2iYmwZM',
        });

      expect(await appService.shortenUrl('youtube.com')).toEqual(
        'https://linkzipper.com/3QhrPi3mRhcoS7P2iYmwZM',
      );
      expect(prismaUpsertSpy).toHaveBeenCalled();
      expect(cachedSetSpy).toHaveBeenCalled();
    });
  });

  describe('getOriginalUrl', () => {
    beforeEach(async () => {
      await redisMock.flushall();

      await redisMock.set(
        'twitch.com',
        'https://linkzipper.com/202NJ5eaZTylbJtb9Dji7t',
      );
      await redisMock.set(
        'https://linkzipper.com/202NJ5eaZTylbJtb9Dji7t',
        'twitch.com',
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return cached long URL', async () => {
      const prismaFindUniqueSpy = jest.spyOn(prismaService.url, 'findUnique');

      expect(
        await appService.getOriginalUrl(
          'https://linkzipper.com/202NJ5eaZTylbJtb9Dji7t',
        ),
      ).toEqual('twitch.com');
      expect(prismaFindUniqueSpy).not.toHaveBeenCalled();
    });
    it('should return a long URL from the database if it does not exist in the cache and cached it', async () => {
      const cachedGetSpy = jest
        .spyOn(cacheService, 'get')
        .mockResolvedValue(null);
      const prismaFindUniqueSpy = jest
        .spyOn(prismaService.url, 'findUnique')
        .mockResolvedValue({
          originalUrl: 'twitch.com',
          shortUrl: 'https://linkzipper.com/202NJ5eaZTylbJtb9Dji7t',
        });

      expect(
        await appService.getOriginalUrl(
          'https://linkzipper.com/202NJ5eaZTylbJtb9Dji7t',
        ),
      ).toEqual('twitch.com');
    });
    it('should return null if long Url does not exist', async () => {
      const cachedGetSpy = jest
        .spyOn(cacheService, 'get')
        .mockResolvedValue(null);
      const prismaFindUniqueSpy = jest
        .spyOn(prismaService.url, 'findUnique')
        .mockResolvedValue(null);

      expect(
        await appService.getOriginalUrl(
          'https://linkzipper.com/202NJ5eaZTylbJtb9Dji7t',
        ),
      ).toEqual(null);
    });
  });
});
