import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-route.module';
import { SETTINGS_COMPONENTS } from './pages';
import { MaterialModule } from '@app/core/views/theme/material.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { backupReducer } from './_reducers/backup.reducers';
import { BackupEffects } from './_effects/backup.effects';
import { BackupService } from './_services';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@app/shared/shared.module';
import { SettingsComponent } from './settings.component';
import { PartialsModule } from '@app/core/views/partials/partials.module';
import { LayoutUtilsService } from '@app/core/views/crud';

@NgModule({
  declarations: [SettingsComponent, ...SETTINGS_COMPONENTS],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MaterialModule,
    HttpClientModule,
    PartialsModule,
    SharedModule,
    StoreModule.forFeature('backup', backupReducer),
    EffectsModule.forFeature([BackupEffects]),
  ],
  exports: [SettingsComponent],
  entryComponents: [SettingsComponent, ...SETTINGS_COMPONENTS],
  providers: [
    BackupService,
    LayoutUtilsService
  ]
})
export class SettingsModule { }
