// Actions
import { AuthActions, AuthActionTypes } from '../_actions/auth.actions';
// Models
import { UserType } from '../_models/user.model';

export interface AuthState {
    loggedIn: boolean;
    user: UserType;
    isUserLoaded: boolean;
}

export const initialAuthState: AuthState = {
    loggedIn: false,
    user: undefined,
    isUserLoaded: false
};

export function authReducer(state = initialAuthState, action: AuthActions): AuthState {
    switch (action.type) {
        case AuthActionTypes.Login: {
            const _user = action.payload.user;
            return {
                loggedIn: true,
                user: _user,
                isUserLoaded: false
            };
        }

        case AuthActionTypes.Register: {
            return {
                loggedIn: true,
                user: undefined,
                isUserLoaded: false
            };
        }

        case AuthActionTypes.Logout:
            return initialAuthState;

        case AuthActionTypes.UserLoaded: {
            const _user: UserType = action.payload.user;
            return {
                ...state,
                user: _user,
                isUserLoaded: true
            };
        }

        default:
            return state;
    }
}
