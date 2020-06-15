import {MixinLambda, Class, ZeroBaseClass, HasConstructor, HasAnyFunction} from './decorator.types'

type ExtendedClass<HC> = Class<HC> & {
    dfOnConstructorTime( that: Class<HC>): void;
  };

// Extendable class version
export const makeParent = ( payloadLambda: MixinLambda<any>) => class extends payloadLambda( ZeroBaseClass) {};

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
    const extendedClass = extendClass<HC>( hostClass, payloadLambda) as ExtendedClass<HC>;
    extendedClass.dfOnConstructorTime?.( extendedClass);
    return extendedClass;
  }
}

export const extendClass = <HC>(
  Base : HC,
  mixinLambda: MixinLambda<HC> )
  : Class<HC> => mixinLambda( Base);



