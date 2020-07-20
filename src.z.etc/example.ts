import {OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';

import {makeDecorator, makeParent, HasBoottimeClassProcessing, Class, AnyMixinLambda, Constructable} from 'decoratorf'

// export abstract class HasBoottimeClassProcessing<HC> {
//   static boottimeClassProcessing: BoottimeClassProcessing<any>;
// }

interface HasInit extends OnInit {}
interface HasDestroy extends OnDestroy {}
interface HasInitAndDestroy extends OnInit, OnDestroy {}

// Sample payload mixin lambda
const LHasSubscriptionCollector: AnyMixinLambda =
    <HC extends Constructable<HasInitAndDestroy>>( HostClass: Class<HC>, ...params) =>
        //@ts-ignore
        class HasSubscriptionCollector extends HostClass
            implements HasInitAndDestroy, HasBoottimeClassProcessing<HC>
        {

          static boottimeClassProcessing( classSignature: HC, ...params: any[]): void {
            console.warn('boottimeClassProcessing BB:Unsubscribe', classSignature, ...params);
          }

          ngUnsubscribe = new Subject<void>();

          meName = this.constructor.name + ' (this) and ' + (super.constructor != undefined? super.constructor.name + ' (sup)': 'no sup');
          hello = 'Hello, Ludwig Wittgenstein aka ' + this.meName;

          private pseudoConstructor(): string {
            console.warn('pseudoConstructor BB:Unsubscribe, hello: ', this.hello, ', me name: ', this.helloPost, ...params);
            return 'sse';
          }
          private pseudoConstructorCaller = this.pseudoConstructor();

          helloPost = 'Hello, Winnie (the Pooh) aka' + this.meName;
          // constructor(       // Not usable in Angular in case of decorators due to the injection trickery
          //   ...param: any[]
          // ) {
          //   super(...param);
          // }

          ngOnInit(): void {

            console.warn('init BB:Unsubscribe');
            if (super.ngOnInit !== undefined) {
              console.warn('init BB:Unsubscribe super called');
              super.ngOnInit();
            }
          }

          ngOnDestroy(): void {
            if (super.ngOnDestroy !== undefined) {
              console.warn('destroy BB:Unsubscribe super called');
              super.ngOnDestroy();
            }

            console.warn('destroy BB:Unsubscribe');
            this.ngUnsubscribe.next();
            this.ngUnsubscribe.complete();
          }
        }


export const HasSubscriptionCollector = makeDecorator( LHasSubscriptionCollector);
export type HasSubscriptionCollector = InstanceType<typeof HasSubscriptionCollector>;

export const HasSubscriptionCollectorClass = makeParent( LHasSubscriptionCollector);
