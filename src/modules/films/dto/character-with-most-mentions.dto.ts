import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class characterWithMostMentionsDto {
  @Field(() => [String])
  character: string[];
}
