import { Component, ElementRef, EventEmitter, Input, Output, } from '@angular/core';
import { UserType } from '@app/modules/auth/_models/user.model';
import { BaseTopBarMenuComponent } from '../topbar/base-top-bar-menu.component';

@Component({
  selector: 'account-dropdown',
  templateUrl: './account-dropdown.component.html',
  styleUrls: ['./account-dropdown.component.scss']
})
export class AccountDropdownComponent extends BaseTopBarMenuComponent {
  @Input() user: UserType;
  @Output() handleLogout = new EventEmitter();
	public badgeBg: string;

  // Random background for generated user avatar
	private _colorRange: string[] = ['#69D2E7', '#A7DBDB', '#E0E4CC', '#F38630', '#FA6900'];

  constructor(protected _elRef: ElementRef) {
    super(_elRef);
		this.badgeBg = this._colorRange[Math.floor(Math.random() * this._colorRange.length)];
  }

  onLogout() {
    this.handleLogout.emit();
  }
}
