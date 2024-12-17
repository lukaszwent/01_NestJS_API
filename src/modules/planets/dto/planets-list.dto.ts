import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PlanetDetailsDto } from './planet-details.dto';

@ObjectType()
export class PlanetsListDto {
  @Field(() => Int)
  count: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pages: number;

  @Field(() => Boolean)
  isNext: boolean;

  @Field(() => Boolean)
  isPrevious: boolean;

  @Field(() => [PlanetDetailsDto])
  results: PlanetDetailsDto[];

  @Field(() => Number)
  limit: number;
}
