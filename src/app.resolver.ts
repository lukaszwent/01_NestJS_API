import { Query } from '@nestjs/graphql';
import { AppService } from './app.service';

export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => String)
  getAppInfo() {
    return this.appService.getHello();
  }
}
