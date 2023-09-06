/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test } from '@nestjs/testing';
import { AppService } from '../app.service';
import { AppController } from '../app.controller';
import { UrlDTO } from '../dtos/url.dto';
import { validate } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import RedisMock from 'ioredis-mock';
import { CacheService } from '../services/cache.service';
import { PrismaService } from '../services/prisma.service';
import { RedisService } from '../services/redis/redis.service';
import { ShortenerService } from '../services/shortener.service';
import Redis from 'ioredis';

describe('AppService', () => {
  let appService: AppService;
  let appController: AppController;
  let configService: ConfigService;
  let prismaService: PrismaService;
  let redisService: RedisService;
  let shortenerService: ShortenerService;
  let cacheService: CacheService;
  let redisMock: Redis;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [AppController],
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
    appController = moduleRef.get<AppController>(AppController);
    appService = moduleRef.get<AppService>(AppService);
    configService = moduleRef.get<ConfigService>(ConfigService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
    redisService = moduleRef.get<RedisService>(RedisService);
    redisMock = moduleRef.get('REDIS_CLIENT');
    shortenerService = moduleRef.get<ShortenerService>(ShortenerService);
    cacheService = moduleRef.get<CacheService>(CacheService);
  });

  describe('validation', () => {
    it('should return an error if the URL is invalid', async () => {
      const url = 'https://invalidURL';
      const DtoObject = new UrlDTO();
      DtoObject.url = url;
      const error = await validate(DtoObject);

      expect(error.length).not.toBe(0);
      expect(error[0].constraints).toEqual({
        isUrl: 'Must be a valid URL',
      });
    });
  });

  describe('shortenUrl', () => {
    it('should call appService.shortenUrl if the URL is valid', async () => {
      const shortenUrlSpy = jest
        .spyOn(appService, 'shortenUrl')
        .mockResolvedValue('https://linkzipper.com/202NJ5eaZTylbJtb9Dji7t');
      const url = 'https://someurl.com';
      const DtoObject = new UrlDTO();
      DtoObject.url = url;
      expect(await appController.shortenUrl(DtoObject)).toEqual(
        'https://linkzipper.com/202NJ5eaZTylbJtb9Dji7t',
      );
      expect(shortenUrlSpy).toBeCalledTimes(1);
    });
  });

  describe('getOriginalUrl', () => {
    it('should call appService.originalUrl if the URL is valid', async () => {
      const getOriginalUrlSpy = jest
        .spyOn(appService, 'getOriginalUrl')
        .mockResolvedValue('twitch.com');
      const url = 'https://someurl.com';
      const DtoObject = new UrlDTO();
      DtoObject.url = url;
      expect(await appController.getOriginalUrl(DtoObject)).toEqual(
        'twitch.com',
      );
      expect(getOriginalUrlSpy).toBeCalledTimes(1);
    });
  });
});
