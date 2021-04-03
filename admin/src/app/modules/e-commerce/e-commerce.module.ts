// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// Translate Module
import { TranslateModule } from '@ngx-translate/core';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// UI
// Core => Services
import {
  // Reducers
  dashboardReducer,
  customersReducer,
  productReducer,
  storeReducer,
  categoryReducer,
  orderReducer,
  optionSetReducer,
  // Effects
  CustomerEffects,
  ProductEffects,
  StoreEffects,
  CategoryEffects,
  OrderEffects,
  DashboardEffects,
  // Services
  CustomerService,
  ProductService,
  StoreService,
  CategoryService,
  OrderService,
  DashBoardService,
  OptionSetService
} from '@app/modules/e-commerce';
// Core => Utils
import {
  HttpUtilsService,
  TypesUtilsService,
  InterceptService,
  LayoutUtilsService,
} from '@app/core/views/crud';
// Shared
import {
  ActionNotificationComponent,
  ConfirmDialogComponent,
  FetchEntityDialogComponent,
  UpdateStatusDialogComponent,
} from '@app/core/views/partials/content/crud';
// Components
import { PRESENTATION_COMPONENTS } from './components';
import { E_COMMERCE_COMPONENTS } from './pages';

import {
  NgbProgressbarModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';
import { PartialsModule } from '@app/core/views/partials/partials.module';
import { ModuleGuard } from '../auth';
import { ECommerceRoutingModule } from './e-commerce-route.module';
import { MaterialModule } from '@app/core/views/theme/material.module';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { SharedModule } from '@app/shared/shared.module';
import { CoreModule } from '@app/core/core.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { OptionSetEffects } from './_effects/option-set.effects';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [...PRESENTATION_COMPONENTS, ...E_COMMERCE_COMPONENTS],
  imports: [
    CommonModule,
    HttpClientModule,
    PartialsModule,
    SharedModule,
    CoreModule,
    NgxPermissionsModule.forChild(),
    FormsModule,
    ECommerceRoutingModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    MaterialModule,
    NgbProgressbarModule,
    NgxMatSelectSearchModule,
    DragDropModule,
    StoreModule.forFeature('dashboard', dashboardReducer),
    StoreModule.forFeature('products', productReducer),
    StoreModule.forFeature('customers', customersReducer),
    StoreModule.forFeature('stores', storeReducer),
    StoreModule.forFeature('categories', categoryReducer),
    StoreModule.forFeature('orders', orderReducer),
    StoreModule.forFeature('optionSets', optionSetReducer),
    EffectsModule.forFeature([ProductEffects, CustomerEffects, StoreEffects, CategoryEffects, OrderEffects, DashboardEffects, OptionSetEffects]),
  ],
  providers: [
    ModuleGuard,
    InterceptService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptService,
      multi: true,
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        panelClass: 'kt-mat-dialog-container__wrapper',
        height: 'auto',
        width: '900px',
      },
    },
    TypesUtilsService,
    LayoutUtilsService,
    HttpUtilsService,
    CustomerService,
    ProductService,
    StoreService,
    CategoryService,
    OrderService,
    DashBoardService,
    OptionSetService
  ],
  entryComponents: [
    ActionNotificationComponent,
    ConfirmDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
    ...PRESENTATION_COMPONENTS,
    ...E_COMMERCE_COMPONENTS,
  ],
})
export class ECommerceModule { }
