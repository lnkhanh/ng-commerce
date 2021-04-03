import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SHARED_COMPONENTS } from "./components";
import { SHARED_PIPES } from './pipes';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';
import { BaseService } from './services/base.service';
import { LazyLoadImageModule, LAZYLOAD_IMAGE_HOOKS, ScrollHooks } from 'ng-lazyload-image';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		NgxPaginationModule,
		RouterModule,
		LazyLoadImageModule
	],
	declarations: [...SHARED_PIPES, ...SHARED_COMPONENTS],
	exports: [
		CommonModule,
		FormsModule,
		...SHARED_PIPES,
		...SHARED_COMPONENTS
	],
	providers: [
		BaseService,
		{ provide: LAZYLOAD_IMAGE_HOOKS, useClass: ScrollHooks },
		...SHARED_PIPES
	]
})

export class SharedModule { }