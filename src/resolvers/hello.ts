import { Resolver, Query } from 'type-graphql';

@Resolver()
export class HelloWorldResolver {
  constructor(private helloWorldString: string) {
    this.helloWorldString = 'Hello World';
  }

  @Query(() => String)
  helloWorld(): string {
    return this.helloWorldString;
  }
}
