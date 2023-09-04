import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import nodeConfig from './configs/node.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      load: [nodeConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
