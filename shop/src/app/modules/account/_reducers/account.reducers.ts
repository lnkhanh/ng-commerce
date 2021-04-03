import produce from 'immer';
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { AccountActions } from '../_actions/account.actions';
import { UserType } from '@app/modules/auth/_models/user.model';

export interface AccountState extends EntityState<UserType> {
}

export const adapter: EntityAdapter<UserType> = createEntityAdapter<
	UserType
>();

export const initialAccountState: AccountState = produce(
	adapter.getInitialState({}),
	(draft) => draft
);

export function accountReducer(
	state = initialAccountState,
	action: AccountActions
): AccountState {
	return produce(state, (draft) => {
		return draft;
	});
}

export const getAccountState = createFeatureSelector<AccountState>('account');
