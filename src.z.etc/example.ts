import {OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';

import {Constructable, makeDecorator, makeParent, AnyMixinLambda} from 'decoratorf'

interface IHasInit extends OnInit {}
interface IHasDestroy extends OnDestroy {}
interface IHasInitAndDestroy extends OnInit, OnDestroy {}

// Sample payload mixin lambda
const LHasSubscriptionCollector: AnyMixinLambda =
  <HC extends Constructable<IHasInitAndDestroy>>( HostClass: HC) => class extends HostClass implements IHasInitAndDestroy
  {

    ngUnsubscribe = new Subject<void>();

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
