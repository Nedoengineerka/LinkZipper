import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStart(): string {
    return 'Welcome to LinkZipper!\nSend a link to /shorten to shorten it or a shortened link to /original to get the original link.';
  }
}
