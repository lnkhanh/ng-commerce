import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CategoryType } from '@app/modules/e-commerce';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, tap } from 'rxjs/operators';
import { FilterProductType } from '../../_models/pos.model';

@Component({
  selector: 'product-filter-bar',
  templateUrl: './product-filter-bar.component.html',
  styleUrls: ['./product-filter-bar.component.scss']
})
export class ProductFilterBarComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @Input() categories$: Observable<CategoryType[]>;
  @Output() handleOnFilter = new EventEmitter();

  public filter: FilterProductType;

  private destroy$: Subject<boolean>;

  constructor() {
    this.filter = {
      keyword: '',
      catIds: []
    };
    this.destroy$ = new Subject<boolean>();
  }

  ngOnInit(): void {
    this.searchSub();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onSelectFilter(catId: string) {
    if (!catId) {
      this.filter.catIds = [];
      this.handleOnFilter.emit(this.filter);
      return;
    }

    const foundIdx = this.filter.catIds.indexOf(catId);

    if (foundIdx !== -1) {
      this.filter.catIds.splice(foundIdx, 1);
      this.handleOnFilter.emit(this.filter);
      return;
    }

    this.filter.catIds.push(catId);
    this.handleOnFilter.emit(this.filter);
  }

  findSelected(catId: string) {
    return this.filter.catIds.indexOf(catId) !== -1;
  }

  onClearKeyword() {
    this.searchInput.nativeElement.value = '';
    this.filter.keyword = '';
    this.handleOnFilter.emit(this.filter);
  }

  private searchSub() {
    fromEvent(
      this.searchInput.nativeElement,
      'keyup'
    )
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        tap((event: any) => {
          const kw = event.target.value.trim();
          this.filter.keyword = kw;
          this.handleOnFilter.emit(this.filter);
        })
      ).subscribe();
  }
}
