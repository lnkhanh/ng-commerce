import {
  NgModule,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Moment
import { MomentModule } from 'ngx-moment';
// Module Input mask
import { NgxMaskModule, IConfig } from 'ngx-mask';

import { SHARED_PIPES } from './pipes/index';
import { SHARED_DIRECTIVES } from './directives/index';
import { SHARED_COMPONENTS } from './components/index';
import { PartialsModule } from '@app/core/views/partials/partials.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};
/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */
@NgModule({
  imports: [CommonModule, FormsModule, PartialsModule, MatIconModule, MatTooltipModule, NgxMaskModule.forRoot(options)],
  declarations: [SHARED_PIPES, SHARED_DIRECTIVES, SHARED_COMPONENTS],
  exports: [
    SHARED_PIPES,
    SHARED_DIRECTIVES,
    SHARED_COMPONENTS,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    NgxMaskModule,
  ],
  providers: [SHARED_PIPES, CurrencyPipe],
})
export class SharedModule {
}
