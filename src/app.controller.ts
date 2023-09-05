import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  UseFilters,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UrlDTO } from './dtos/url.dto';
import { HttpExceptionFilter } from './filters/http-exception.filter';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Post('/shorten')
  @UseFilters(new HttpExceptionFilter())
  shortenUrl(@Body() body: UrlDTO): Promise<string> {
    return this.appService.shortenUrl(body.url).catch(() => {
      throw new HttpException('Server internal error. Try later.', 500);
    });
  }

  @Get('/original')
  @UseFilters(new HttpExceptionFilter())
  getOriginalUrl(@Body() body: UrlDTO): Promise<string> {
    return this.appService.getOriginalUrl(body.url).catch(() => {
      throw new HttpException('Server internal error. Try later.', 500);
    });
  }
}
