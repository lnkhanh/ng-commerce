// Angular
import { Component, HostBinding } from '@angular/core';
// NGRX
import { AppState } from '@app/core/reducers';
import { Store } from '@ngrx/store';
// State
import { Logout } from '@module/auth';

@Component({
	selector: 'kt-topbar',
	templateUrl: './topbar.component.html',
	styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {

	@HostBinding('class') classes = 'kt-header__topbar kt-grid__item';

	/**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 */
	constructor(private store: Store<AppState>) {
	}

	/**
	 * Log out
	 */
	logout() {
		this.store.dispatch(new Logout());
	}
}
