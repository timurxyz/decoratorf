
export type Class<Instance> = {
    new(...params: any[]): Instance;  // ConstructorFn
    prototype: {};
  };
// see also Type in https://github.com/angular/angular/blob/master/packages/compiler/src/core.ts
type AnyFunctions<T = any> = (...args: any[]) => any;
type ConstructorFn<Instance = object> = new (...params: any[]) => Instance;
export type Constructable<Anything> = ConstructorFn<Anything>;
export class ZeroBaseClass {}
// export type ZeroBaseClassAs<HC> = Class<ZeroBaseClass>;
// type ZeroBaseClassConstructor = typeof ZeroBaseClass;
type SuppressNew<T> = { [K in keyof T]: T[K] };
export type ClassWithStatics<Instance extends ZeroBaseClass, Static extends object = object>  = {
    new(...props: any[]): Instance & SuppressNew<Static>;
    prototype: {};
  }
// see also https://github.com/bryntum/chronograph/blob/master/src/class/Mixin.ts

export type Mixin<T extends AnyFunctions> = InstanceType<ReturnType<T>>;
//export type MixinLambda<HC extends PreMixin, PreMixin = ZeroBaseClass> = (base: HC) => Class<HC>;
export type MixinLambda<HC> = (base: HC) => Class<HC>;

// Extendable class version
export const makeParent = ( payloadLambda: MixinLambda<any>) => class extends payloadLambda( ZeroBaseClass) {};

// Decorator version
export function makeDecorator<HC>(
  payloadLambda: MixinLambda<HC>)
  :{ new (...args: any[]): any; (...args: any[]): any; (...args: any[]): (hostClass: HC) => Class<HC>;}
{
  // crunched from the makeDecorator in the Angular util/decorators.ts code
  // Mixin, <kind of>
  return DecoratorFactory<HC>( payloadLambda) as any;
}

export const DecoratorFactory = <HC>(payloadLambda: MixinLambda<HC>) => () => {
  // a decorator mixin
  return function TypeDecorator(
    hostClass: HC) {
    return extendClass<HC>( hostClass, payloadLambda);
  }
}

export const extendClass = <HC>(
  Base : HC,
  mixinLambda: MixinLambda<HC> )
  : Class<HC> => mixinLambda( Base);



