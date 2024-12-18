import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { HttpClientService } from './services/http-client.service';
import { RedisModule } from '@nestjs-modules/ioredis';

@Global()
@Module({
  imports: [HttpModule, RedisModule],
  controllers: [],
  providers: [HttpClientService],
  exports: [HttpClientService],
})
export class CommonModule {}
