import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AppState } from '@app/core/reducers';
import { CustomValidators } from '@app/shared/utils/validators';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { CreateStoreTableAction, UpdateStoreTableAction } from '@app/modules/e-commerce/_actions/store.actions';
import { selectCurrentStoreTable } from '@app/modules/e-commerce/_selectors/store.selectors';
import { selectPageLoading } from '@app/core/selectors/loading.selectors';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StoreTableType } from '@app/modules/e-commerce/_models/store.model';

@Component({
  selector: 'ng-com-compose-item-note-dialog',
  templateUrl: './compose-item-note-dialog.component.html',
  styleUrls: ['./compose-item-note-dialog.component.scss']
})
export class ComposeItemNoteDialogComponent implements OnInit {
  public frm: FormGroup;
  public formSubmitting: boolean;
  public formSubmitted: boolean;

  constructor(
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<ComposeItemNoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string,
      note: string
    }
  ) {
    this.formSubmitted = false;
  }

  ngOnInit() {
    this.initForm();
    if (this.data && this.data.note) {
      this.fillData(this.data.note);
    }
  }

  onSubmit() {
    this.formSubmitted = true;

    if (!this.frm.dirty || this.frm.invalid) {
      return;
    }

    this._dialogRef.close(this.composeData());
  }

  get f() {
    if (!this.frm) {
      return {};
    }
    return this.frm.controls;
  }

  getErrorMessage(control: FormControl) {
    if (control.errors.maxlength) {
      return 'Maximum 250 character length.';
    }

    return '';
  }

  private initForm() {
    this.frm = this._fb.group({
      note: [
        '',
        [
          Validators.maxLength(250),
          CustomValidators.noWhiteSpaceValidator,
        ],
      ],
    });
  }

  private fillData(note: string) {
    this.f.note.setValue(note);
    this.frm.markAsPristine();
  }

  private composeData(): { note: string } {
    const { note } = this.f;

    const data = {
      note: note.value,
    };

    return data;
  }
}