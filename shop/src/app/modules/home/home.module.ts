import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { HomeRoutingModule } from './home-route.module';
import { HOME_COMPONENTS } from './components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HOME_PAGES } from './pages';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// Reducers
import { homeReducer } from './_reducers/home.reducers';
import { cartReducer } from './_reducers/cart.reducers';
import { wishListReducer } from './_reducers/wishlist.reducers';

// Effects
import { HomeEffects } from './_effects/home.effects';
import { WishListEffects } from './_effects/wishlist.effects';

// Services
import { HomeService } from './_services/home.service';
import { SharedModule } from '@app/shared/shared.module';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {
  validation: false,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    SharedModule,
    NgxMaskModule.forRoot(options),
    StoreModule.forFeature('home', homeReducer),
    StoreModule.forFeature('cart', cartReducer),
    StoreModule.forFeature('wishList', wishListReducer),
    EffectsModule.forFeature([HomeEffects, WishListEffects]),
  ],
  declarations: [...HOME_COMPONENTS, ...HOME_PAGES],
  entryComponents: [...HOME_COMPONENTS, ...HOME_PAGES],
  providers: [
    HomeService
  ]
})
export class HomeModule { }
