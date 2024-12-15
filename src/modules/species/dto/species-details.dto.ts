import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SpeciesDetailsDto {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  classification: string;

  @Field(() => String)
  designation: string;

  @Field(() => String)
  average_height: string;

  @Field(() => String)
  skin_colors: string;

  @Field(() => String)
  hair_colors: string;

  @Field(() => String)
  eye_colors: string;

  @Field(() => String)
  average_lifespan: string;

  @Field(() => String)
  homeworld: string;

  @Field(() => String)
  language: string;

  @Field(() => [String])
  people: string[];

  @Field(() => [String])
  films: string[];

  @Field(() => String)
  created: string;

  @Field(() => String)
  edited: string;

  @Field(() => String)
  url: string;
}
