import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaginatorModel } from '@app/shared/models/common';
import { Observable } from 'rxjs';
import { ProductType } from '../../_models/product.model';

@Component({
  selector: 'list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css']
})
export class ListProductComponent implements OnInit {
  @Input() products$: Observable<ProductType[]>;
  @Output() handlePageChange = new EventEmitter();
  @Output() handleAddToCart = new EventEmitter();
  @Output() handleAddToWishList = new EventEmitter();
  @Output() handleOpenProductQuickViewModal = new EventEmitter();

  // Paginator
  @Input() paginator$: Observable<PaginatorModel>;
  @Input() loadingList$: Observable<boolean>;
  public pageSizeOptions: number[] = [6, 12, 24, 36, 100];

  constructor() { }

  ngOnInit(): void {
  }

  onAddToCart(product: ProductType) {
    this.handleAddToCart.emit(product);
  }

  onAddToWishList(product: ProductType) {
    this.handleAddToWishList.emit(product);
  }

  handleOnChangePaging(data) {
    this.handlePageChange.emit({...data});
  }
  
  onOpenProductQuickViewModal(product: ProductType) {
    this.handleOpenProductQuickViewModal.emit(product);
  }
}
