import { Injectable } from '@nestjs/common';

@Injectable()
export class ShortenerService {
  shortenURL(url: string): string {
    return url + 'short';
  }
}
