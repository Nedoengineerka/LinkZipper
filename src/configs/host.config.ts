import { registerAs } from '@nestjs/config';

export default registerAs('host', () => ({
  host: process.env.HOST || 'https://linkzipper.com',
}));
