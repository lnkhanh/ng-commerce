// Angular
import { Component, Input, OnInit } from '@angular/core';
// RxJS
import { Observable } from 'rxjs';
// NGRX
import { select, Store } from '@ngrx/store';
// State
import { AppState } from '@core/reducers';
import { currentUser, Logout, User } from '@app/modules/auth';

@Component({
	selector: 'kt-user-profile2',
	templateUrl: './user-profile2.component.html',
})
export class UserProfile2Component implements OnInit {
	// Public properties
	public user$: Observable<User>;
	public colorRange: string[] = ['#69D2E7', '#A7DBDB', '#E0E4CC', '#F38630', '#FA6900'];
	public badgeBg: string;
	// http://everyknightshoulddesign.blogspot.com/2013/08/beautiful-color-palettes-their-hex-codes.html
	/**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 */
	constructor(private store: Store<AppState>) {
		this.badgeBg = this.colorRange[Math.floor(Math.random() * this.colorRange.length)];
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.user$ = this.store.pipe(select(currentUser));
	}

	/**
	 * Log out
	 */
	logout() {
		this.store.dispatch(new Logout());
	}
}
