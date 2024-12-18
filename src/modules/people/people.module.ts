import { Module } from '@nestjs/common';
import { PeopleService } from './application/people.service';
import { PeopleRepository } from './infrastructure/people.repository';
import { PeopleMapper } from './people.mapper';

@Module({
  imports: [],
  controllers: [],
  providers: [PeopleService, PeopleRepository, PeopleMapper],
  exports: [PeopleService],
})
export class PeopleModule {}
