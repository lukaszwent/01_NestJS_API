import { Field, ObjectType } from '@nestjs/graphql';
import { FilmDetailsDto } from './film-details.dto';

@ObjectType()
export class FilmsListDto {
  @Field(() => [FilmDetailsDto])
  results: FilmDetailsDto[];
}
