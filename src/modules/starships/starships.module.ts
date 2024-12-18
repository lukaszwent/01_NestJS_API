import { Module } from '@nestjs/common';
import { StarshipService } from './application/starship.service';
import { StarshipRepository } from './infrastructure/starship.repository';
import { StarshipDetailsResolver } from './presentation/starship-details.resolver';
import { StarshipsListResolver } from './presentation/starships-list.resolver';
import { StarshipMapper } from './starship.mapper';

@Module({
  imports: [],
  controllers: [],
  providers: [
    StarshipService,
    StarshipRepository,
    StarshipDetailsResolver,
    StarshipsListResolver,
    StarshipMapper,
  ],
})
export class StarshipsModule {}
