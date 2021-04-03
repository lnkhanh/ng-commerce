import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StoreType } from '@app/modules/e-commerce/_models/store.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'select-store',
  templateUrl: './select-store.component.html',
  styleUrls: ['./select-store.component.scss']
})
export class SelectStoreComponent implements OnInit {
  @Input() stores$: Observable<StoreType[]>;
  @Input() currentStore: StoreType;
  @Output() handleSelectStore = new EventEmitter();

  public currentStoreId: string;

  constructor() { 
    this.currentStoreId = '';
  }

  ngOnInit() { 
    if (this.currentStore) {
      this.currentStoreId = this.currentStore.id
    }
  }

  onChangeStore(store) {
    this.handleSelectStore.emit(store);
  }
}
