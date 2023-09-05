import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  redisUrl: process.env.REDIS_URL || 'localhost',
  port: +process.env.REDIS_PORT || 6379,
}));
