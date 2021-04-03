import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CORE_TYPES } from '@core/index';
import { RequestInterceptor } from './interceptors/request.interceptor';
import { CacheInterceptor } from './interceptors/cache.interceptor';
import {
  // Pipes
  FirstLetterPipe,
  GetObjectPipe,
  DynamicPipe,
  JoinPipe,
  SafePipe,
  TimeElapsedPipe,
  // Directives
  ContentAnimateDirective,
  HeaderDirective,
  MenuDirective,
  OffcanvasDirective,
  ScrollTopDirective,
  SparklineChartDirective,
  StickyDirective,
  TabClickEventDirective,
  ToggleDirective,
} from './views/layout';

@NgModule({
  imports: [CommonModule, FormsModule, HttpClientModule],
  declarations: [
    // directives
    ScrollTopDirective,
    HeaderDirective,
    OffcanvasDirective,
    ToggleDirective,
    MenuDirective,
    TabClickEventDirective,
    SparklineChartDirective,
    ContentAnimateDirective,
    StickyDirective,
    // pipes
    DynamicPipe,
    TimeElapsedPipe,
    JoinPipe,
    GetObjectPipe,
    SafePipe,
    FirstLetterPipe,
  ],
  exports: [
    // directives
    ScrollTopDirective,
    HeaderDirective,
    OffcanvasDirective,
    ToggleDirective,
    MenuDirective,
    TabClickEventDirective,
    SparklineChartDirective,
    ContentAnimateDirective,
    StickyDirective,
    // pipes
    DynamicPipe,
    TimeElapsedPipe,
    JoinPipe,
    GetObjectPipe,
    SafePipe,
    FirstLetterPipe,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
    CORE_TYPES,
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
  ],
})
export class CoreModule { }
