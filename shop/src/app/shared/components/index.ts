import { TopbarComponent } from './topbar/topbar.component';
import { BannerComponent } from './banner/banner.component';
import { FooterComponent } from './footer/footer.component';
import { LazyImage } from './lazy-img/lazy-img';
import { SpinnerComponent } from './spinner/spinner.component';
import { Paginator } from './paginator/paginator';
import { AccountDropdownComponent } from './account-dropdown/account-dropdown.component';
import { CartDropdownComponent } from './cart-dropdown/cart-dropdown.component';

export const SHARED_COMPONENTS = [
	TopbarComponent,
	AccountDropdownComponent,
	CartDropdownComponent,
	Paginator,
	BannerComponent,
	FooterComponent,
	LazyImage,
	SpinnerComponent
];
