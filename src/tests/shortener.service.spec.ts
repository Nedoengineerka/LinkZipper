/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import hostConfig from '../configs/host.config';
import { ShortenerService } from '../services/shortener.service';

describe('AppService', () => {
  let configService: ConfigService;
  let shortenerService: ShortenerService;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          expandVariables: true,
          load: [hostConfig],
        }),
      ],
      providers: [ConfigService, ShortenerService],
    }).compile();
    configService = moduleRef.get<ConfigService>(ConfigService);
    shortenerService = moduleRef.get<ShortenerService>(ShortenerService);
  });

  describe('shortenUrl', () => {
    beforeAll(() => {
      jest.mock('base-x');
    });

    it('should return url like ${host}/${hashedUuid}', async () => {
      const { host } = configService.get<ConfigType<typeof hostConfig>>('host');
      expect(await shortenerService.shortenUrl()).toMatch(
        new RegExp(`^${host}/`),
      );
    });
  });
});
