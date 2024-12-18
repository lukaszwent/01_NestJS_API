import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UniqueWordPairsDto {
  @Field(() => [[String, Number]])
  uniqueWordPairs: (string | number)[][];
}
