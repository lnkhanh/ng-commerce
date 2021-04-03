import { Injectable } from '@angular/core';
import { IResponseData } from '@app/shared/models/common';
import { NgCommerceHttpClient } from '@app/modules-services/ng-commerce/ng-commerce-api.service';
import { Observable } from 'rxjs';

@Injectable()
export class BaseService {
	private _categoryUrl = '/categories';
	private _cartUrl = '/cart-items';

	constructor(private _api: NgCommerceHttpClient) { }

	fetchCategories(): Observable<IResponseData> {
		return this._api.get<IResponseData>(`${this._categoryUrl}`);
	}

	fetchCart() {
		return this._api.get<IResponseData>(`${this._cartUrl}`);
	}
}