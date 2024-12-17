import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { PlanetService } from './application/planet.service';
import { PlanetRepository } from './infrastructure/planet.repository';
import { PlanetDetailsResolver } from './presentation/planet-details.resolver';
import { PlanetsListResolver } from './presentation/planets-list.resolver';
import { PlanetMapper } from './planet.mapper';

@Module({
  imports: [RedisModule],
  controllers: [],
  providers: [
    PlanetService,
    PlanetRepository,
    PlanetDetailsResolver,
    PlanetsListResolver,
    PlanetMapper,
  ],
})
export class PlanetsModule {}
