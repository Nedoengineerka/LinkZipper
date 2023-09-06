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
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

describe('AppService', () => {
  let appService: AppService;
  let appController: AppController;
  let configService: ConfigService;
  let prismaService: PrismaService;
  let redisService: RedisService;
  let shortenerService: ShortenerService;
  let cacheService: CacheService;
  let redisMock: Redis;

  let app: INestApplication;

  beforeAll(async () => {
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

    app = moduleRef.createNestApplication();
    await app.init();
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
    it('should return shorted URL', () => {
      return request(app.getHttpServer())
        .post('/shorten')
        .type('form')
        .send({ url: 'test.com' })
        .expect(201);
    });
  });

  describe('getOriginalUrl', () => {
    it('should call appService.originalUrl if the URL is valid', () => {
      return request(app.getHttpServer())
        .get('/original')
        .type('form')
        .send({ url: 'https://linkzipper.com/202NJ5eaZTylbJtb9Dji7t' })
        .expect(200);
    });
  });
});
