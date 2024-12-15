import { Field, Int, ObjectType } from '@nestjs/graphql';
import { FilmDetailsDto } from './film-details.dto';

@ObjectType()
export class FilmsListDto {
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

  @Field(() => [FilmDetailsDto])
  results: FilmDetailsDto[];
}
