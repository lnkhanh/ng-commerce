import { Injectable } from '@angular/core';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '@shared/reducers';

import { AddLoadingAction, RemoveLoadingAction } from '@shared/actions/loading.actions';
import { BaseActionTypes, FetchAllCategoriesAction, FetchUserCartAction, SaveCategoriesAction, SaveUserCartAction } from '../actions/base.actions';
import { BaseService } from '../services/base.service';

@Injectable()
export class BaseEffects {
	@Effect()
	fetchCategories$ = this
		.actions$
		.pipe(ofType<FetchAllCategoriesAction>(BaseActionTypes.FetchAllCategories), switchMap(() => {
			this
				.store
				.dispatch(new AddLoadingAction({ currentAction: BaseActionTypes.FetchAllCategories }));

			return this
				.baseSvc
				.fetchCategories();
		}), map((rs) => {
			this
				.store
				.dispatch(new RemoveLoadingAction({ currentAction: BaseActionTypes.FetchAllCategories }));
			if (!rs || !rs.data) {
				throw new Error('');
			}

			return new SaveCategoriesAction(rs.data);
		}), catchError((error, caught) => {
			this
				.store
				.dispatch(new RemoveLoadingAction({ currentAction: BaseActionTypes.FetchAllCategories }));

			return caught;
		}));

	@Effect()
	fetchCart$ = this
		.actions$
		.pipe(ofType<FetchUserCartAction>(BaseActionTypes.FetchUserCart), switchMap(() => {
			this
				.store
				.dispatch(new AddLoadingAction({ currentAction: BaseActionTypes.FetchUserCart }));

			return this
				.baseSvc
				.fetchCart();
		}), map((rs) => {
			this
				.store
				.dispatch(new RemoveLoadingAction({ currentAction: BaseActionTypes.FetchUserCart }));
			if (!rs || !rs.data) {
				throw new Error('');
			}

			return new SaveUserCartAction(rs.data);
		}), catchError((error, caught) => {
			this
				.store
				.dispatch(new RemoveLoadingAction({ currentAction: BaseActionTypes.FetchUserCart }));
			return caught;
		}));

	constructor(private actions$: Actions, private baseSvc: BaseService, private store: Store<AppState>) { }
}
