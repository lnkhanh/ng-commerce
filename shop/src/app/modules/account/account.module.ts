import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountRoutingModule } from './account-route.module';
import { ACCOUNT_PAGES } from './pages';
import { ACCOUNT_COMPONENTS } from './components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { SharedModule } from '@app/shared/shared.module';

// Reducers
import { orderReducer } from './_reducers/order.reducers';
import { accountReducer } from './_reducers/account.reducers';
import { wishListReducer } from './_reducers/wishlist.reducers';

// Effects
import { OrderEffects } from './_effects/order.effects';
import { AccountEffects } from './_effects/account.effects';
import { WishListEffects } from './_effects/wishlist.effects';

// Services
import { OrderService } from './_services/order.service';
import { AccountService } from './_services/account.service';
import { WishListService } from './_services/wishlist.service';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  declarations: [...ACCOUNT_PAGES, ...ACCOUNT_COMPONENTS],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AccountRoutingModule,
    SharedModule,
    NgxMaskModule.forRoot(options),
    StoreModule.forFeature('order', orderReducer),
    StoreModule.forFeature('wishlist', wishListReducer),
    StoreModule.forFeature('account', accountReducer),
    EffectsModule.forFeature([OrderEffects, AccountEffects, WishListEffects]),
  ],
  entryComponents: [...ACCOUNT_PAGES, ...ACCOUNT_COMPONENTS],
  providers: [OrderService, AccountService, WishListService]
})
export class AccountModule { }
