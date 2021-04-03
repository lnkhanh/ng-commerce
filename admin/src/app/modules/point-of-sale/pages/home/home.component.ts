import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { CategoryType, CustomerModel, OrderType, ProductType } from '@app/modules/e-commerce';
import { AppState } from '@app/core/reducers';
import { selectPageLoading } from '@app/core/selectors/loading.selectors';
import { AddCartItemAction, CheckoutAction, FetchAllCategoriesAction, FetchAllProductsAction, FetchCartAction, SaveListAction, UpdateCartItemQuantityAction } from '../../_actions/pos.actions';
import { selectAllCategories, selectAllProducts, selectCurrentCart, selectStoreTables } from '../../_selectors/pos.selectors';
import { AddCartItemData, CartItemType, CartType, CheckoutData, FilterProductType, OrderSource } from '../../_models/pos.model';
import { LayoutUtilsService } from '@app/core/views/crud';
import { take, takeUntil } from 'rxjs/operators';
import { ChangeOrderStatusAction, FetchOrderListAction, RemoveOrderAction, SaveRequestParamsAction } from '../../_actions/order.actions';
import { PaymentGateways } from '@app/modules/e-commerce/_models/order.model';
import { PosOrderDataSource } from '../../_data-sources/order.datasource';
import { RequestParamModel } from '@app/core/models/common';
import { MatDialog } from '@angular/material/dialog';
import { OrderListDialogComponent } from '../order-list-dialog/order-list-dialog.component';
import { OrderDetailsDialogComponent } from '../order-details-dialog/order-details-dialog.component';
import { StoreTableType, StoreType } from '@app/modules/e-commerce/_models/store.model';

const CURRENT_STORE_KEY = 'currentStore';
const CURRENT_TABLE_KEY = 'currentTable';

@Component({
	selector: 'kt-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
	public loading$: Observable<boolean>;
	public products$: Observable<ProductType[]>;
	public categories$: Observable<CategoryType[]>;
	public cart$: Observable<CartType>;
	public tables$: Observable<StoreTableType[]>;
	public currentTable: StoreTableType;

	// Order list
	public orderDataSource: PosOrderDataSource;
	public orderListColumns = [
		'table',
		'status',
		'orderDate',
		'actions',
	];

	private products: ProductType[];
	private destroy$: Subject<boolean>;

	constructor(private _store: Store<AppState>, private _dialog: MatDialog, private _layoutUtilsService: LayoutUtilsService) {
		this._fetchAllProducts();
		this._fetchCart();
		this._fetchAllCategories();
		this._fetchOrders();
		this._fetchCurrentTable();
		this.orderDataSource = new PosOrderDataSource(this._store);
		this.destroy$ = new Subject<boolean>();
	}

	ngOnInit() {
		this.loading$ = this._store.pipe(select(selectPageLoading));
		this.products$ = this._store.pipe(select(selectAllProducts()));
		this.cart$ = this._store.pipe(select(selectCurrentCart()));
		this.categories$ = this._store.pipe(select(selectAllCategories()));
		this.tables$ = this._store.pipe(select(selectStoreTables()));
		this.products$.pipe(
			takeUntil(this.destroy$)
		).subscribe((products) => {
			if (products && products.length && !this.products) {
				this.products = products;
			}
		});
	}

	ngOnDestroy() {
		this.destroy$.next(true);
		this.destroy$.unsubscribe();
	}

	onChangeTable(table: StoreTableType) {
		localStorage.setItem(CURRENT_TABLE_KEY, JSON.stringify(table));
	}

	// Order summary
	onAddCartItem(productId: string) {
		const data: AddCartItemData = {
			productId,
		};
		this._store.dispatch(new AddCartItemAction({ data }));
	}

	onRemoveCartItem(item: CartItemType) {
		const title = 'Remove item';
		const description = `Are you sure you want to remove this item?`;
		const waitDescription = 'Removing....';
		const dialogRef = this._layoutUtilsService.confirmElement(
			title,
			description,
			waitDescription
		);

		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}

			this._store.dispatch(new UpdateCartItemQuantityAction({ itemId: item.id, quantity: 0, note: '' }));
		});
	}

	onUpdateQuantity(item: CartItemType) {
		this._store.dispatch(new UpdateCartItemQuantityAction({ itemId: item.id, quantity: item.quantity, note: item.note }));
	}

	async onCheckout($event: { note: string, customer: CustomerModel }) {
		if ($event.customer) {
			this.doCheckout($event);
			return;
		}

		const title = 'Do Checkout';
		const description = `No customer is selected. Are you sure you want to checkout?`;
		const waitDescription = 'Submitting....';
		const submitLabel = 'Checkout';
		const dialogRef = this._layoutUtilsService.confirmElement(
			title,
			description,
			waitDescription,
			submitLabel
		);

		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}

			this.doCheckout($event);
		});
	}

	private async doCheckout(payload: { note: string, customer: CustomerModel }) {
		const cart = await this.cart$.pipe(take(1)).toPromise();
		const storeStr = localStorage.getItem(CURRENT_STORE_KEY);
		const tableStr = localStorage.getItem(CURRENT_TABLE_KEY);

		if (!cart || !storeStr || !tableStr) {
			return;
		}

		const store = <StoreType>JSON.parse(storeStr);
		const table = <StoreTableType>JSON.parse(tableStr);

		const data: CheckoutData = {
			method: PaymentGateways.CASH,
			cart: cart.items,
			address: store.address,
			storeId: store.id,
			storeName: store.name,
			tableName: table.name,
			note: payload.note,
			source: OrderSource.WEB_ADMIN
		};

		if (payload.customer) {
			const { id, phone, firstName, lastName, email } = payload.customer;

			data.customerId = id;
			data.phone = phone;
			data.firstName = firstName;
			data.lastName = lastName;
			data.email = email;
		}
		
		this._store.dispatch(new CheckoutAction({ data }));
	}
	// /Order summary

	// Order list
	onOrderPagination(filter) {
		const params: RequestParamModel = {
			pageIndex: filter.pageIndex,
			pageSize: filter.pageSize,
			keyword: ''
		};

		this._store.dispatch(new SaveRequestParamsAction({ params }));
		this._fetchOrders();
	}

	onShowOrderListDialog() {
		const dialogRef = this._dialog.open(OrderListDialogComponent, {
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('The dialog was closed');
		});
	}

	onChangeOrderStatus(data: { orderId: string, status: number }) {
		this._store.dispatch(new ChangeOrderStatusAction({ orderId: data.orderId, status: data.status, reloadList: true }));
	}

	onEditOrder(order: OrderType) {
		if (!order) {
			return;
		}

		const dialogRef = this._dialog.open(OrderDetailsDialogComponent, {
			panelClass: ['full-width-dialog', 'kt-mat-dialog-container__wrapper'],
			data: order.id
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('The dialog was closed');
		});
	}

	onRemoveOrder(order: OrderType) {
		if (!order) {
			return;
		}

		this._store.dispatch(new RemoveOrderAction({ orderId: order.id }));
	}
	// /Order list

	// Filter
	onFilterProducts(filter: FilterProductType) {
		if (!this.products) {
			return;
		}

		let result;

		if (!filter.keyword && filter.catIds.length === 0) {
			return this._store.dispatch(new SaveListAction({ response: this.products }));
		}

		if (filter.keyword && filter.catIds.length === 0) {
			result = this.products.filter((product) => product.name.toLowerCase().includes(filter.keyword));
			return this._store.dispatch(new SaveListAction({ response: result }));
		}

		// Filter by categories.
		if (!filter.keyword) {
			result = this.products.filter((product) => filter.catIds.includes(product.categoryId));
			return this._store.dispatch(new SaveListAction({ response: result }));
		}

		result = this.products.filter((product) => product.name.toLowerCase().includes(filter.keyword) && filter.catIds.includes(product.categoryId));

		return this._store.dispatch(new SaveListAction({ response: result }));
	}
	// /Filter

	private _fetchAllProducts() {
		return this._store.dispatch(new FetchAllProductsAction());
	}

	private _fetchAllCategories() {
		return this._store.dispatch(new FetchAllCategoriesAction());
	}

	private _fetchCart() {
		return this._store.dispatch(new FetchCartAction());
	}

	private _fetchOrders() {
		return this._store.dispatch(new FetchOrderListAction());
	}

	private _fetchCurrentTable() {
		const table = localStorage.getItem(CURRENT_TABLE_KEY);

		if (table) {
			this.currentTable = JSON.parse(table);
		}
	}
}
