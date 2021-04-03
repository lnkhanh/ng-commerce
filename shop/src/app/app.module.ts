import { Injectable, NgModule } from '@angular/core';
import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from './layouts/base/base.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { environment } from '@env/environment';
import { EffectsModule } from '@ngrx/effects';
import { AuthService } from './modules/auth';
import { AuthModule } from '@app/modules/auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { reducers, metaReducers } from './shared/reducers';
import { BaseEffects } from './shared/effects/base.effects';
import { loadingReducer } from './shared/reducers/loading.reducers';
import { baseReducer } from './shared/reducers/base.reducers';

// custom configuration Hammerjs
@Injectable()
export class HammerConfig extends HammerGestureConfig {
  overrides = {
    // I will only use the swap gesture so
    // I will deactivate the others to avoid overlaps
    pinch: { enable: false },
    rotate: { enable: false }
  } as any;
}

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-commerce' }),
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    NgbModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreModule.forFeature('base', baseReducer),
    StoreModule.forFeature('loading', loadingReducer),
    EffectsModule.forRoot([BaseEffects]),
    AuthModule.forRoot(),
    StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
    StoreDevtoolsModule.instrument({
      name: 'NgCommerce',
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
  ],
  declarations: [
    AppComponent,
    BaseComponent
  ],
  bootstrap: [AppComponent],
  exports: [
    BaseComponent
  ],
  providers: [
    AuthService,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig,
    },
  ]
})
export class AppModule {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(APP_ID) private appId: string) {
    const platform = isPlatformBrowser(platformId) ?
      'in the browser' : 'on the server';
    console.log(`Running ${platform} with appId=${appId}`);
  }
}
