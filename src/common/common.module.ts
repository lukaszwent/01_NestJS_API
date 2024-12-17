import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { HttpClientService } from './services/http-client.service';

@Global()
@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [HttpClientService],
  exports: [HttpClientService],
})
export class CommonModule {}
