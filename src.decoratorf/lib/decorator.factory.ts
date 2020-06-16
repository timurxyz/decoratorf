import {MixinLambda, Class, ZeroBaseClass, HasConstructor, HasAnyFunction} from './decorator.types'


// Extendable class version
export const makeParent = ( payloadLambda: MixinLambda<any>) =>
  extendAndCallDfOnConstructorTime( class extends payloadLambda( ZeroBaseClass) {});

// Decorator version
export function makeDecorator<HC>(
  payloadLambda: MixinLambda<HC>)
  : HasConstructor<any> & HasAnyFunction & { (...args: any[]): MixinLambda<HC>;}
{
  return DecoratorFactory<HC>( payloadLambda) as any;
}
// crunched from the makeDecorator in the Angular util/decorators.ts code
// Mixin, <kind of>

export const DecoratorFactory = <HC>(payloadLambda: MixinLambda<HC>) => () => {
  // a decorator mixin
  return function TypeDecorator(
    hostClass: HC) {
    return extendAndCallDfOnConstructorTime( extendClass<HC>( hostClass, payloadLambda));
  }
}

export const extendClass = <HC>(
  Base : HC,
  mixinLambda: MixinLambda<HC> )
  : Class<HC> => mixinLambda( Base);

export const extendAndCallDfOnConstructorTime = <HC>(
  extendedClass: Class<HC>) => {

  interface ExtendedClass<HC> extends Class<HC> {
    dfOnConstructorTime( that: Class<HC>): void;
  };

  ( extendedClass as ExtendedClass<HC>).dfOnConstructorTime?.( extendedClass);
  return extendedClass;
}




