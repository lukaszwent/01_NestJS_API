import { Field, Int, ObjectType } from '@nestjs/graphql';
import { StarshipDetailsDto } from './starship-details.dto';

@ObjectType()
export class StarshipsListDto {
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

  @Field(() => [StarshipDetailsDto])
  results: StarshipDetailsDto[];
}
