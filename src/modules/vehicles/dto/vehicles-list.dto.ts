import { Field, Int, ObjectType } from '@nestjs/graphql';
import { VehicleDetailsDto } from './vehicle-details.dto';

@ObjectType()
export class VehiclesListDto {
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

  @Field(() => [VehicleDetailsDto])
  results: VehicleDetailsDto[];
}
