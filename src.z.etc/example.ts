import {OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';

import {makeDecorator, makeParent, HasPreInstantiationProcessing, PreInstantiationProcessing, Class, AnyMixinLambda, Constructable} from 'decoratorf'

interface HasInit extends OnInit {}
interface HasDestroy extends OnDestroy {}
interface HasInitAndDestroy extends OnInit, OnDestroy {}

// Sample payload mixin lambda
const LHasSubscriptionCollector: AnyMixinLambda =
  <HC extends Constructable<HasInitAndDestroy>>( HostClass: Class<HC>) =>
    class extends HostClass implements HasInitAndDestroy, HasPreInstantiationProcessing<HC>
  {

    ngUnsubscribe = new Subject<void>();

    static preInstantiationProcessing(that: HC, ...params: any[]): void {
      console.warn('preInstantiation BB:Unsubscribe', that, ...params);
    }

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
