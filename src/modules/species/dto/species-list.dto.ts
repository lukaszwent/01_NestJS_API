import { Field, Int, ObjectType } from '@nestjs/graphql';
import { SpeciesDetailsDto } from './species-details.dto';

@ObjectType()
export class SpeciesListDto {
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

  @Field(() => [SpeciesDetailsDto])
  results: SpeciesDetailsDto[];

  @Field(() => Number)
  limit: number;
}
