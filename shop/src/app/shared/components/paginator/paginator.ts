import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { PaginatorModel } from '@shared/models/common';
import { PaginationInstance } from 'ngx-pagination';
import { Observable, Subject, Subscription } from 'rxjs';
import {
  buffer,
  debounceTime,
} from 'rxjs/operators';

const BUTTON_DEBOUNCE_TIME = 300;

@Component({
  selector: 'paginator',
  templateUrl: './paginator.html',
  styleUrls: ['./paginator.scss'],
})
export class Paginator implements OnInit, OnDestroy {
  @Input() paginator$: Observable<PaginatorModel>;
  @Input() pageSizeOptions?: number[] = [5, 12, 25, 50, 100];
  @Input() loading$: Observable<boolean>;
  @Output() doChange = new EventEmitter();
  public config: PaginationInstance;
  public items = [];
  public isReady: boolean;
  public isDisplay: boolean;

  private updatePageSubject;
  private debounceUpdatePage$;
  private updatePage$;
  private subscriptions: Subscription[];

  constructor() {
    this.isReady = false;
    this.subscriptions = [];
    this.updatePageSubject = new Subject();
    this.debounceUpdatePage$ = this.updatePageSubject.pipe(
      debounceTime(BUTTON_DEBOUNCE_TIME)
    );
    this.updatePage$ = this.updatePageSubject.pipe(
      buffer(this.debounceUpdatePage$)
    );
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((u) => u.unsubscribe());
  }

  onChangePage(pageNum) {
    this.config.currentPage = pageNum;
    this.updatePage$.next(pageNum);
  }

  onPageSizeChange() {
    const data = new PaginatorModel({
      pageSize: this.config.itemsPerPage,
      pageIndex: 1,
    });

    this.doChange.emit(data);
  }

  private init() {
    // Compose and dispatch last event
    const updatePageSub = this.updatePage$.subscribe((listPage: number[]) => {
      if (listPage && listPage.length) {
        const lastPage = listPage[listPage.length - 1];
        const data = new PaginatorModel({
          pageSize: this.config.itemsPerPage,
          pageIndex: lastPage,
        });

        this.doChange.emit(data);
      }
    });

    const paginationSub = this.paginator$.subscribe((paginator) => {
      const { pageSize, pageIndex, totalItems, totalPages } = paginator;
      this.config = {
        id: 'dxp-paginator-' + new Date().getTime(),
        itemsPerPage: pageSize,
        currentPage: pageIndex,
        totalItems: totalItems,
      };
      this.isReady = true;
      this.isDisplay = totalPages > 1;
    });

    this.subscriptions.push(updatePageSub);
    this.subscriptions.push(paginationSub);
  }
}
