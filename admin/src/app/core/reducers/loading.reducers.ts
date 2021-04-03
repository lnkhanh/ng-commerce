import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import produce from 'immer';
import { find } from 'lodash';

import { LoadingActions, LoadingActionTypes } from '../actions/loading.actions';

export interface LoadingState {
  loadingActions: string[];
}
export const adapter: EntityAdapter<LoadingState> = createEntityAdapter<
  LoadingState
>();

const initialState: LoadingState = produce(
  adapter.getInitialState({
    loadingActions: [],
  }),
  (draft) => draft
);

export function loadingReducer(
  state = initialState,
  action: LoadingActions
): LoadingState {
  return produce(state, (draft) => {
    switch (action.type) {
      case LoadingActionTypes.ADD_LOADING:
        {
          const { currentAction } = action.payload;
          let loadingActions = [...state.loadingActions];
          const found = find(state.loadingActions, item => item === currentAction);
          if (!found) {
            if (!loadingActions.length) {
              loadingActions = [currentAction];
            } else {
              loadingActions.push(currentAction);
            }
          }

          draft.loadingActions = loadingActions;
        }
        break;
      case LoadingActionTypes.REMOVE_LOADING:
        {
          const { currentAction } = action.payload;
          let loadingActions = [...state.loadingActions];
          const found = find(state.loadingActions, item => item === currentAction);
          if (found) {
            loadingActions = loadingActions.filter(item => item !== currentAction);
          }

          draft.loadingActions = loadingActions;
        }
        break;
      default:
        break;
    }
  });
}
