import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PeopleDetailsDto } from './people-details.dto';

@ObjectType()
export class PeopleListDto {
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

  @Field(() => [PeopleDetailsDto])
  results: PeopleDetailsDto[];

  @Field(() => Number)
  limit: number;
}
