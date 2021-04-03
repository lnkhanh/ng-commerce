import { Component, ElementRef, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
	template: '',
  host: {
    '(document:click)': 'onPageClick($event)',
  }
})
export class BaseTopBarMenuComponent implements OnInit, OnDestroy {
	@HostBinding("class.visible") isVisible: boolean = false;
	@Input() isOpened$: Observable<boolean>;
	@Output() handleToggleMenu = new EventEmitter();

	private destroy$: Subject<void>;

	constructor(protected _elRef: ElementRef) {
		this.destroy$ = new Subject();
	}

	ngOnInit(): void {
		this._watchStateOnChange();
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	onToggleMenu() {
		this.handleToggleMenu.emit();
	}

	/**
	 * Close menu on opening
	 * @param $event 
	 */
	onPageClick($event) {
    if (this.isVisible && !this._elRef.nativeElement.contains($event.target)) {
      this.onToggleMenu();
    }
  }

	private _watchStateOnChange() {
		this.isOpened$.pipe(
			takeUntil(this.destroy$)
		).subscribe((isVisible) => {
			this.isVisible = isVisible;
		});
	}
}
