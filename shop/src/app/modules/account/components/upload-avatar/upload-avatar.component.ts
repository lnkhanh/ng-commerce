import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserType } from '@app/modules/auth/_models/user.model';
import each from 'lodash-es/each';

@Component({
  selector: 'upload-avatar',
  templateUrl: './upload-avatar.component.html',
  styleUrls: ['./upload-avatar.component.scss']
})
export class UploadAvatarComponent implements OnInit {
  @Input() user: UserType;
  @Output() handleUploadAvatar = new EventEmitter();
  @Output() handleRemoveAvatar = new EventEmitter();

  // constructor(private _toastService: ToastService, private _layoutUtilsService: LayoutUtilsService) { }
  constructor() { }

  ngOnInit(): void {
  }

  uploadFile(event: FileList) {
    const validImageTypes = ['image/jpeg', 'image/png'];
    const formData = new FormData();

    let isInvalid = false;

    each(event, (fileData: File) => {
      if (!fileData || validImageTypes.indexOf(fileData.type) < 0) {
        // this._toastService.showDanger('Ảnh không hợp lệ!');
        isInvalid = true;
        return;
      } else {
        formData.append('photo', fileData, fileData.name);
      }
    });

    if (!isInvalid) {
      this.handleUploadAvatar.emit(formData);
    }
  }

  onRemoveAvatar() {
    // const title = 'Remove avatar';
    // const description = `Are you sure you want to remove avatar?`;
    // const waitDescription = 'Removing....';
    // const dialogRef = this._layoutUtilsService.confirmElement(
    //   title,
    //   description,
    //   waitDescription
    // );

    // dialogRef.afterClosed().subscribe((res) => {
    //   if (!res) {
    //     return;
    //   }

    // });
    this.handleRemoveAvatar.emit();
  }
}
