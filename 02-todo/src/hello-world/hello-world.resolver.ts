import { Args, Float, Int, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HelloWorldResolver {

  @Query( () => String, { description: 'Hola Mundo es lo que retorna ', name: 'hello' } )
  helloWorld(): string {
    return 'Hello World!';
  }

  @Query( () => Float, { name: 'randomNumber' } )
  getRandomNumber(): number {
    return Math.random() * 100;
  }

  @Query( () => Int, { name: 'randomFromZeroTo', description: 'From zero to Argument TO' } )
  getRandomFromZeroTo( 
    @Args( 'to', { nullable: true, type: () => Int } ) to: number = 6
  ): number {
    return Math.floor( Math.random() * to );
  }

}
