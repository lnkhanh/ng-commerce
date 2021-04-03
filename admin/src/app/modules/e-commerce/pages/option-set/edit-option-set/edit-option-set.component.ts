import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '@app/core/reducers';
import { selectPageLoading } from '@app/core/selectors/loading.selectors';
import { SubheaderService } from '@app/core/views/layout';
import { FetchOptionSetDetailsAction, UpdateOptionSetAction } from '@app/modules/e-commerce/_actions/option-set.actions';
import { Option, OptionSet, optionSetControlTypes } from '@app/modules/e-commerce/_models/option-set.model';
import { selectCurrentOptionSet } from '@app/modules/e-commerce/_selectors/option-set.selectors';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { skipWhile, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ng-com-edit-option-set',
  templateUrl: './edit-option-set.component.html',
  styleUrls: ['./edit-option-set.component.scss']
})
export class EditOptionSetComponent implements OnInit, OnDestroy {
  public title: string;
  public optionSetId: string;
  public loading$: Observable<boolean>;
  public optionSet$: Observable<OptionSet>;
  public optionSetControlTypes;
  public optionSetOptions: Option[];

  private _optionSet: OptionSet;
  private destroy$: Subject<void>;

  constructor(
    private _route: ActivatedRoute,
    private _subheaderService: SubheaderService,
    private _store: Store<AppState>,
    private _location: Location,
  ) {
    this.optionSetId = this._route.snapshot.paramMap.get('id');
    this.optionSetControlTypes = optionSetControlTypes;
    this.destroy$ = new Subject();
    this.optionSetOptions = [];
  }

  ngOnInit(): void {
    if (!this.optionSetId) {
      this.onBack();
    }

    this._fetchDetails();
    this.optionSet$ = this._store.pipe(select(selectCurrentOptionSet()));
    this.loading$ = this._store.pipe(select(selectPageLoading));
    this.optionSet$.pipe(
      skipWhile((isNull) => !isNull),
      takeUntil(this.destroy$)
    ).subscribe((optSet) => {
      if (optSet) {
        this.title = `Option Set: ${optSet.name}`;
        this._subheaderService.setBreadcrumbs([
          { title: 'eCommerce', page: `/ecommerce/dashboard` },
          { title: 'Option Sets', page: `/ecommerce/option-sets` },
          { title: `${optSet.name}`, page: `` },
        ]);
        this._optionSet = {...optSet};
        this.optionSetOptions = [...optSet.options].sort((a, b) => (b.displayOrder - a.displayOrder));
      } else {
        this.onBack();
      }
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  onUpdateOptionSet(data: OptionSet) {
    if (!data) {
      return;
    }

    this._store.dispatch(
      new UpdateOptionSetAction({ ...data, id: this.optionSetId, options: this.optionSetOptions })
    );
  }

  onSubmitNewOption(data: Option) {
    if (!data) {
      return;
    }

    data.displayOrder = this.optionSetOptions.length;
    this.optionSetOptions.push(data);
    this.onUpdateOptionSet(this._optionSet);
  }

  onUpdateOptions(options: Option[]) {
    this.optionSetOptions = [...options];
    this.onUpdateOptionSet(this._optionSet);
  }

  onBack() {
    this._location.back();
  }

  private _fetchDetails() {
    return this._store.dispatch(
      new FetchOptionSetDetailsAction({ optionSetId: this.optionSetId })
    );
  }
}
