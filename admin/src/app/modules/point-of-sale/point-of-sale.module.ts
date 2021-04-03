import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PosRoutingModule } from './point-of-sale-route.module';
import { POS_PAGES } from '.';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { POS_COMPONENTS } from './components';
import { HttpClientModule } from '@angular/common/http';
import { ThemeModule } from '@app/core/views/theme/theme.module';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@app/core/views/theme/material.module';
import { SharedModule } from '@app/shared/shared.module';
import { PartialsModule } from '@app/core/views/partials/partials.module';

// Reducers
import { posReducer } from './_reducers/pos.reducers';
import { posOrderReducer } from './_reducers/order.reducers';

// Effects
import { PosEffects } from './_effects/pos.effects';
import { PosOrderEffects } from './_effects/order.effects';

// Services
import { PosService, PosOrderService } from './_services';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';

@NgModule({
  imports: [
    CommonModule,
    PosRoutingModule,
    HttpClientModule,
    SharedModule,
    PartialsModule,
    ThemeModule,
    FormsModule,
    MaterialModule,
    StoreModule.forFeature('pos', posReducer),
    StoreModule.forFeature('posOrder', posOrderReducer),
    EffectsModule.forFeature([PosEffects, PosOrderEffects]),
  ],
  exports: [],
  providers: [
    PosService,
    PosOrderService,
    {
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'kt-mat-dialog-container__wrapper',
        height: 'auto',
			}
		},
  ],
  entryComponents: [...POS_COMPONENTS, ...POS_PAGES],
  declarations: [...POS_COMPONENTS, ...POS_PAGES],
})
export class PointOfSaleModule { }
