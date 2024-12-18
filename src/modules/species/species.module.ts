import { Module } from '@nestjs/common';
import { SpeciesService } from './application/species.service';
import { SpeciesRepository } from './infrastructure/species.repository';
import { SpeciesDetailsResolver } from './presentation/species-details.resolver';
import { SpeciesListResolver } from './presentation/species-list.resolver';
import { SpeciesMapper } from './species.mapper';

@Module({
  imports: [],
  controllers: [],
  providers: [
    SpeciesService,
    SpeciesRepository,
    SpeciesDetailsResolver,
    SpeciesListResolver,
    SpeciesMapper,
  ],
})
export class SpeciesModule {}
