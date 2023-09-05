import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ShortenDTO } from './dtos/shorten.dto';
import { RedisKey } from 'ioredis';
import { OriginalDTO } from './dtos/original.dto';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get()
  getStart(): string {
    return this.appService.getStart();
  }

  @Post('/shorten')
  async shortenerURL(@Body() url: ShortenDTO): Promise<RedisKey | string> {
    try {
      return await this.appService.shortenerURL(url.originalURL);
    } catch (err) {
      return err.message;
    }
  }

  @Get('/original')
  async getOriginalURL(@Body() url: OriginalDTO): Promise<string> {
    try {
      return await this.appService.getOriginalURL(url.shortURL);
    } catch (err) {
      return err.message;
    }
  }
}
