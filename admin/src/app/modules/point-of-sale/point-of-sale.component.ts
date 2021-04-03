// Angular
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
// RxJS
import { Observable, Subject } from 'rxjs';
// Object-Path
import * as objectPath from 'object-path';
// Layout
import { LayoutConfigService } from '../../core/views/layout';
import { HtmlClassService } from '../../core/views/theme/html-class.service';
import { LayoutConfig } from '../../core/views/_config/layout.config';
// User permissions
import { select, Store } from '@ngrx/store';
import { AppState } from '@core/reducers';
import { takeUntil } from 'rxjs/operators';
import { FetchAllStoresAction, FetchStoreTablesAction, SaveCurrentStoreAction } from '@app/modules/point-of-sale/_actions/pos.actions';
import { StoreType } from '@app/modules/e-commerce/_models/store.model';
import { selectAllStores } from '@app/modules/point-of-sale/_selectors/pos.selectors';
import { cloneDeep } from 'lodash';

const CURRENT_STORE_KEY = 'currentStore';
const CURRENT_TABLE_KEY = 'currentTable';

@Component({
	selector: 'kt-pos-layout',
	templateUrl: './point-of-sale.component.html',
	styleUrls: ['./point-of-sale.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class PosLayoutComponent implements OnInit, OnDestroy {
	public selfLayout: string;
	public fluid: boolean;
	public stores$: Observable<StoreType[]>;

	public currentStore: StoreType;

	private destroy$: Subject<boolean>;

	constructor(
		private layoutConfigService: LayoutConfigService,
		private htmlClassService: HtmlClassService,
		private _store: Store<AppState>,
	) {
		this._getCurrentStore();
		this._fetchAllStores();
		this.destroy$ = new Subject();
		this.stores$ = this._store.pipe(select(selectAllStores()));
		this.layoutConfigService.loadConfigs(new LayoutConfig().configs);

		// setup element classes
		this.htmlClassService.setConfig(this.layoutConfigService.getConfig());

		this.layoutConfigService.onConfigUpdated$.pipe(
			takeUntil(this.destroy$)
		).subscribe(layoutConfig => {
			// reset body class based on global and page level layout config, refer to html-class.service.ts
			document.body.className = '';
			this.htmlClassService.setConfig(layoutConfig);
		});
	}

	ngOnInit(): void {
		const config = this.layoutConfigService.getConfig();
		this.selfLayout = objectPath.get(config, 'self.layout');
		this.fluid = objectPath.get(config, 'content.width') === 'fluid';

		// let the layout type change
		this.layoutConfigService.onConfigUpdated$.pipe(
			takeUntil(this.destroy$)
		).subscribe(cfg => {
			setTimeout(() => {
				this.selfLayout = objectPath.get(cfg, 'self.layout');
			});
		});
	}

	ngOnDestroy(): void {
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	onSelectStore(store: StoreType) {
		this._setCurrentStore(cloneDeep(store));
	}

	private _fetchAllStores() {
		return this._store.dispatch(new FetchAllStoresAction());
	}

	private _getCurrentStore() {
		const store = localStorage.getItem(CURRENT_STORE_KEY);
		if (store) {
			this.currentStore = <StoreType>JSON.parse(store);
			this._store.dispatch(new SaveCurrentStoreAction({ ...this.currentStore }));
			this._store.dispatch(new FetchStoreTablesAction({ storeId: this.currentStore.id }));
		}
	}

	private _setCurrentStore(store: StoreType) {
		if (!store) {
			return;
		}

		localStorage.setItem(CURRENT_STORE_KEY, JSON.stringify(store));
		this._store.dispatch(new SaveCurrentStoreAction({ ...store }));
		this._store.dispatch(new FetchStoreTablesAction({ storeId: store.id }));

		// Remove current table
		localStorage.removeItem(CURRENT_TABLE_KEY);
	}
}
