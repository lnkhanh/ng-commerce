// Angular
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// NgBootstrap
import {
  NgbDropdownModule,
  NgbModule,
  NgbTabsetModule,
  NgbToastModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
// Perfect Scrollbar
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// Core module
import { CoreModule } from '../../../core/core.module';
// CRUD Partials
import {
  ActionNotificationComponent,
  AlertComponent,
  ConfirmDialogComponent,
  FetchEntityDialogComponent,
  ToastsContainer,
  UpdateStatusDialogComponent,
} from './content/crud';
// Layout partials
import {
  ContextMenu2Component,
  ContextMenuComponent,
  LanguageSelectorComponent,
  NotificationComponent,
  QuickActionComponent,
  QuickPanelComponent,
  ScrollTopComponent,
  SearchDefaultComponent,
  SearchDropdownComponent,
  SearchResultComponent,
  SplashScreenComponent,
  StickyToolbarComponent,
  SubheaderComponent,
  SubheaderSearchComponent,
  UserProfile2Component,
  UserProfile3Component,
  UserProfileComponent,
} from './layout';
// General
import { NoticeComponent } from './content/general/notice/notice.component';
import { PortletModule } from './content/general/portlet/portlet.module';
// Errpr
import { ErrorComponent } from './content/general/error/error.component';
// SVG inline
import { InlineSVGModule } from 'ng-inline-svg';
import { CartComponent } from './layout/topbar/cart/cart.component';
import { LazyImage } from './content/general/lazy-img';
import { MaterialModule } from '../theme/material.module';

@NgModule({
  declarations: [
    ScrollTopComponent,
    NoticeComponent,
    LazyImage,
    ActionNotificationComponent,
    ConfirmDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
    AlertComponent,
    ToastsContainer,

    // topbar components
    ContextMenu2Component,
    ContextMenuComponent,
    QuickPanelComponent,
    ScrollTopComponent,
    SearchResultComponent,
    SplashScreenComponent,
    StickyToolbarComponent,
    SubheaderComponent,
    SubheaderSearchComponent,
    LanguageSelectorComponent,
    NotificationComponent,
    QuickActionComponent,
    SearchDefaultComponent,
    SearchDropdownComponent,
    UserProfileComponent,
    UserProfile2Component,
    UserProfile3Component,
    CartComponent,

    ErrorComponent,
  ],
  exports: [
    PortletModule,

    ScrollTopComponent,
    NoticeComponent,
    LazyImage,
    ActionNotificationComponent,
    ConfirmDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
    AlertComponent,
    ToastsContainer,

    // topbar components
    ContextMenu2Component,
    ContextMenuComponent,
    QuickPanelComponent,
    ScrollTopComponent,
    SearchResultComponent,
    SplashScreenComponent,
    StickyToolbarComponent,
    SubheaderComponent,
    SubheaderSearchComponent,
    LanguageSelectorComponent,
    NotificationComponent,
    QuickActionComponent,
    SearchDefaultComponent,
    SearchDropdownComponent,
    UserProfileComponent,
    UserProfile2Component,
    UserProfile3Component,
    CartComponent,

    ErrorComponent,
    NgbModule,
    NgbDropdownModule,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    InlineSVGModule,
    // CoreModule,
    PortletModule,

    // angular material modules
    MaterialModule,
    CoreModule,

    // ng-bootstrap modules
    NgbModule,
    NgbDropdownModule,
    NgbTabsetModule,
    NgbTooltipModule,
    NgbToastModule
  ],
})
export class PartialsModule {}
