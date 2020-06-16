
export type Mixin<T extends AnyFunction> = InstanceType<ReturnType<T>>;
//export type MixinLambda<HC extends PreMixin, PreMixin = ZeroBaseClass> = (base: HC) => Class<HC>;
export type MixinLambda<HC> = (base: HC, ...params: any[]) => Class<HC>;
export type AnyMixinLambda = MixinLambda<any>;
export type MixinLambdaPrefix<HC> = HC;

export type Class<Instance> = HasConstructor<Instance> & { prototype: {} };
// see also Type in https://github.com/angular/angular/blob/master/packages/compiler/src/core.ts
// cf https://flow.org/en/docs/types/utilities/#toc-class >> ConstructorFn

export type AnyFunction<T = any> = (...args: any[]) => any;
export type VoidLambda = ()=> void;
export type HasAnyFunction<T = any> = { (...args: any[]): T; }

export type ConstructorFn<Instance = object> = new (...params: any[]) => Instance;
export type HasConstructor<Instance = object> = { new (...params: any[]): Instance; }
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

