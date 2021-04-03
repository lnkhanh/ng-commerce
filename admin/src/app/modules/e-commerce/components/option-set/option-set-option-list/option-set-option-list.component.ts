import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Option } from '@app/modules/e-commerce/_models/option-set.model';
import cloneDeep from 'lodash/cloneDeep';
import { LayoutUtilsService } from '@app/core/views/crud';

@Component({
  selector: 'option-set-option-list',
  templateUrl: './option-set-option-list.component.html',
  styleUrls: ['./option-set-option-list.component.scss']
})
export class OptionSetOptionListComponent implements OnInit {
  @Input() options: Option[] = [];
  @Output() handleUpdateOptions = new EventEmitter();
  public displayOptions: Option[];

  constructor(private _layoutUtilsService: LayoutUtilsService) { }

  ngOnInit(): void {
    this.displayOptions = cloneDeep(this.options);
  }

  onDropped($event: CdkDragDrop<string[]>) {
    const { previousIndex, currentIndex } = $event;

    if (previousIndex === currentIndex) {
      return;
    }

    this.displayOptions[previousIndex].displayOrder = currentIndex;
    this.displayOptions[currentIndex].displayOrder = previousIndex;
    moveItemInArray(this.displayOptions, previousIndex, currentIndex);
    this.handleUpdateOptions.emit(this.displayOptions);
  }

  onRemove(idx: number) {
    const title = 'Remove option';
    const description = `Are you sure you want to remove this option?`;
    const waitDescription = 'Removing....';
    const btnLb = 'Ok';
    const dialogRef = this._layoutUtilsService.confirmElement(
      title,
      description,
      waitDescription,
      btnLb
    );

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }

      this.displayOptions.splice(idx, 1);
      this.handleUpdateOptions.emit(this.displayOptions);
    });
  }
}
