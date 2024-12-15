import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FilmDetailsDto {
  @Field(() => String)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  episodeId: string;

  @Field(() => String)
  opening_crawl: string;

  @Field(() => String)
  director: string;

  @Field(() => String)
  producer: string;

  @Field(() => String)
  release_date: string;

  @Field(() => [String])
  characters: string[];

  @Field(() => [String])
  planets: string[];

  @Field(() => [String])
  starships: string[];

  @Field(() => [String])
  vehicles: string[];

  @Field(() => [String])
  species: string[];

  @Field(() => String)
  url: string;

  @Field(() => String)
  created: string;

  @Field(() => String)
  edited: string;
}
