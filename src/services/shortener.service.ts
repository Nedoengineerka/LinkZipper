import { Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import base62, { BaseConverter } from 'base-x';
import hostConfig from 'src/configs/host.config';
import * as uuid from 'uuid';

@Injectable()
export class ShortenerService {
  private base62: BaseConverter;
  constructor(private readonly configService: ConfigService) {
    this.base62 = base62(
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    );
  }
  async shortenUrl(): Promise<string> {
    const { host } =
      this.configService.get<ConfigType<typeof hostConfig>>('host');
    const hashedUrl = this.base62.encode(Buffer.from(uuid.parse(uuid.v4())));
    return `${host}/${hashedUrl}`;
  }
}
