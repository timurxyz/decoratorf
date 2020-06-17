import {MixinLambda, Class, ZeroBaseClass, HasConstructor, HasAnyFunction} from './decorator.types'

export type PreInstantiationProcessing<HC> = (that: Class<HC>, ...params: any[]) => void;
export abstract class HasPreInstantiationProcessing<HC> { 
    // Allows to perform some pseudo-constructor coding even in Angular (at least <=9)
    // which won't work with custom decorators containing constructors 
    // (in a non-Angular situation you can inplement constructors in decorators).
    // Add this to your decorator class though this won't see your decorator/superclass/HostClass instantiated
    // as this runs before real constructing takes place, hense static (and 'that' refers to a class not instance).
    static preInstantiationProcessing: PreInstantiationProcessing<any>; 
  }
interface MayHavePreInstantiationProcessing<HC> { preInstantiationProcessing?: PreInstantiationProcessing<HC>; }
interface ExtendedClass<HC> extends Class<HC>, MayHavePreInstantiationProcessing<HC> {};

// Extendable class version
export const makeParent = ( 
  payloadLambda: MixinLambda<any>, 
  ...params: any[]
  ) =>
  extendAndCallDfOnConstructorTime( class extends payloadLambda( ZeroBaseClass) {}, ...params);

// Decorator version
export const makeDecorator = <HC>(
  payloadLambda: MixinLambda<HC>,
  ...params: any[]
  ): HasConstructor<any> & HasAnyFunction & { (...params: any[]): MixinLambda<HC>;} =>
  DecoratorFactory<HC>( payloadLambda, ...params) as any;

// ☝🏻crunched from the makeDecorator in the Angular util/decorators.ts code
// Mixin, <kind of> 👇🏻

export const DecoratorFactory = <HC>( 
  payloadLambda: MixinLambda<HC>, 
  ...params: any[]
  ) => () => 
  // a decorator mixin
  function TypeDecorator(
    hostClass: HC) {
    return extendAndCallDfOnConstructorTime( extendClass<HC>( hostClass, payloadLambda), ...params);
  }

export const extendClass = <HC>(
  Base : HC,
  mixinLambda: MixinLambda<HC> )
  : Class<HC> => mixinLambda( Base);

export const extendAndCallDfOnConstructorTime = <HC>(
  extendedClass: Class<HC>,
  ...params: any[]) => {
  ( extendedClass as ExtendedClass<HC>).preInstantiationProcessing?.( extendedClass, ...params);
  return extendedClass;
}




