import { Module } from '@nestjs/common';
import { SpeciesService } from './application/species.service';
import { HttpModule } from '@nestjs/axios';
import { SpeciesRepository } from './infrastructure/species.repository';
import { RedisModule } from '@nestjs-modules/ioredis';
import { SpeciesDetailsResolver } from './presentation/species-details.resolver';
import { SpeciesListResolver } from './presentation/species-list.resolver';

@Module({
  imports: [HttpModule, RedisModule],
  controllers: [],
  providers: [
    SpeciesService,
    SpeciesRepository,
    SpeciesDetailsResolver,
    SpeciesListResolver,
  ],
})
export class SpeciesModule {}
