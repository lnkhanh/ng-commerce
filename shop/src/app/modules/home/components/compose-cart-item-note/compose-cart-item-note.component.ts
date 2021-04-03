import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '@app/shared/utils/validators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-compose-cart-item-note',
  templateUrl: './compose-cart-item-note.component.html',
  styleUrls: ['./compose-cart-item-note.component.css']
})
export class ComposeCartItemNoteComponent implements OnInit {
  @Input() data: {
    title: string;
    note: string;
  };
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  public frm: FormGroup;
  public formSubmitting: boolean;
  public formSubmitted: boolean;
  
  constructor(
    private _fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) { 
    this.formSubmitted = false;
  }

  ngOnInit() {
    this.initForm();
    if (this.data && this.data.note) {
      this.fillData(this.data.note);
    }
    console.log(this.data);
  }

  onSubmit() {
    this.formSubmitted = true;

    if (!this.frm.dirty || this.frm.invalid) {
      return;
    }
    this.passEntry.emit(this.composeData());
    this.activeModal.dismiss();
  }

  get f() {
    if (!this.frm) {
      return {};
    }
    return this.frm.controls;
  }

  getErrorMessage(control: AbstractControl) {
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
