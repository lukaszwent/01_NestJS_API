import { Module } from '@nestjs/common';
import { StarshipService } from './application/starship.service';
import { HttpModule } from '@nestjs/axios';
import { StarshipRepository } from './infrastructure/starship.repository';
import { RedisModule } from '@nestjs-modules/ioredis';
import { StarshipDetailsResolver } from './presentation/starship-details.resolver';
import { StarshipsListResolver } from './presentation/starships-list.resolver';

@Module({
  imports: [HttpModule, RedisModule],
  controllers: [],
  providers: [
    StarshipService,
    StarshipRepository,
    StarshipDetailsResolver,
    StarshipsListResolver,
  ],
})
export class StarshipsModule {}
