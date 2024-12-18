import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StarshipDetailsDto {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  model: string;

  @Field(() => String)
  starship_class: string;

  @Field(() => String)
  manufacturer: string;

  @Field(() => String)
  cost_in_credits: string;

  @Field(() => String)
  length: string;

  @Field(() => String)
  crew: string;

  @Field(() => String)
  passengers: string;

  @Field(() => String)
  max_atmosphering_speed: string;

  @Field(() => String)
  hyperdrive_rating: string;

  @Field(() => String)
  MGLT: string;

  @Field(() => String)
  cargo_capacity: string;

  @Field(() => String)
  consumables: string;

  @Field(() => [String])
  pilots: string[];

  @Field(() => String)
  created: string;

  @Field(() => String)
  edited: string;

  @Field(() => String)
  url: string;
}
