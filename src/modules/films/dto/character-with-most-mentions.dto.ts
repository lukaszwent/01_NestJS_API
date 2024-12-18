import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CharacterWithMostMentionsDto {
  @Field(() => [String])
  character: string[];
}
