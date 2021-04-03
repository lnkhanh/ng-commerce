import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastService } from '@app/core/views/partials/content/crud/toast/toast-service';
import { each } from 'lodash';
import { Observable } from 'rxjs';

@Component({
  selector: 'kt-product-image',
  templateUrl: './product-image.component.html',
  styleUrls: ['./product-image.component.scss']
})
export class ProductImageComponent implements OnInit {
  @Input() photos$: Observable<string[]>;
  @Input() loading$: Observable<boolean>;
  @Output() handleUploadProductPhotos = new EventEmitter();

  public displayedColumns: string[] = [
    'image', 'actions'
  ];
  constructor(private _toastService: ToastService) { }

  ngOnInit(): void {
  }

  uploadFile(event: FileList) {
    const validImageTypes = ['image/jpeg', 'image/png'];
    const formData = new FormData();

    let isInvalid = false;

    each(event, (fileData: File) => {
      if (!fileData || validImageTypes.indexOf(fileData.type) < 0) {
        this._toastService.showDanger('Ảnh không hợp lệ!');
        isInvalid = true;
        return false;
      } else {
        formData.append('photo', fileData, fileData.name);
      }
    });

    if (!isInvalid) {
      this.handleUploadProductPhotos.emit(formData);
    }
  }
}
