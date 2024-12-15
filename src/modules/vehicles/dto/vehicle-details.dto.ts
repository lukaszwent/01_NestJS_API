import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VehicleDetailsDto {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  model: string;

  @Field(() => String)
  manufacturer: string;

  @Field(() => String)
  cost_in_credits: string;

  @Field(() => String)
  length: string;

  @Field(() => String)
  max_atmosphering_speed: string;

  @Field(() => String)
  crew: string;

  @Field(() => String)
  passengers: string;

  @Field(() => String)
  cargo_capacity: string;

  @Field(() => String)
  consumables: string;

  @Field(() => String)
  vehicle_class: string;

  @Field(() => [String])
  pilots: string[];

  @Field(() => [String])
  films: string[];

  @Field(() => String)
  created: string;

  @Field(() => String)
  edited: string;

  @Field(() => String)
  url: string;
}
