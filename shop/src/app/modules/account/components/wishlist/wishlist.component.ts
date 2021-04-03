import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WishListType } from '@app/modules/account/_models/wishlist.model';
import { PaginatorModel } from '@app/shared/models/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishListComponent implements OnInit {
  @Input() wishList$: Observable<WishListType[]>;
  @Input() loadingList: Observable<boolean>;
  @Output() handlePageChange = new EventEmitter();
  @Output() handleRemoveFromWishList = new EventEmitter();

  // Paginator
  @Input() paginator$: Observable<PaginatorModel>;
  @Input() loadingList$: Observable<boolean>;

  public pageSizeOptions: number[] = [10, 20, 30];

  constructor() { }

  ngOnInit(): void {
  }

  onRemoveWishList(item: WishListType) {
    this.handleRemoveFromWishList.emit(item.id);
  }

  onChangePaging(data) {
    this.handlePageChange.emit({ ...data });
  }
}
