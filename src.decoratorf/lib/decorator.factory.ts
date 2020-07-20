import {MixinLambda, Class, ZeroBaseClass, HasConstructor, HasAnyFunction} from './decorator.types'

// Extendable class version
export const makeParent = ( 
  payloadLambda: MixinLambda<any>, 
  ...params: any[]
  ) =>
    extendAndCallDfOnConstructorTime(
      class extends payloadLambda( ZeroBaseClass) {},
      ...params);

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
      return extendAndCallDfOnConstructorTime(
        extendClass<HC>( hostClass, payloadLambda, ...params),
        ...params);
  }

export const extendClass = <HC>(
  Base: HC,
  mixinLambda: MixinLambda<HC>,
  ...params: any[]
  ): Class<HC> =>
    mixinLambda( Base, ...params);

export const extendAndCallDfOnConstructorTime = <HC>(
  extendedClass: Class<HC>,
  ...params: any[]
  ) => {
    ( extendedClass as ExtendedClass<HC>).boottimeClassProcessing?.( extendedClass, ...params);
    return extendedClass;
}

// optional:
export type BoottimeClassProcessing<HC> = (classSignature: Class<HC>, ...params: any[]) => void;
export abstract class HasBoottimeClassProcessing<HC> {
    // Allows to perform bootstrap-time class processing.
    // ...params will come from the decorator/class configuration ...params .
    static boottimeClassProcessing: BoottimeClassProcessing<any>; 
  }
interface MayHaveBoottimeClassProcessing<HC> { boottimeClassProcessing?: BoottimeClassProcessing<HC>; }
interface ExtendedClass<HC> extends Class<HC>, MayHaveBoottimeClassProcessing<HC> {};
