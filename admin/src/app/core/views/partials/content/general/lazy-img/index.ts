import { Component, Input, OnChanges } from '@angular/core';
import { environment } from '@env/environment';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'lazy-img',
  templateUrl: 'index.html',
  styleUrls: ['./index.scss'],
})
export class LazyImage implements OnChanges {
  @Input()
  public src: string;
  @Input()
  public alt = '';
  @Input()
  public styles?: any = {};
  @Input()
  public maxWidth?: number = 160;
  @Input()
  public maxHeight?: number = 160;

  public default: string;
  public cached = false;
  public loaded = false;
  public error = false;
  public loading = new BehaviorSubject<boolean>(false);

  private lastSrc: string;

  constructor() {
    this.default = environment.defaultImage;
  }

  public ngOnChanges(changes) {
    if (changes && changes.src && changes.src.currentValue) {
      this.src = changes.src.currentValue;
      this.loading.next(true);
    }

    if (this.src !== this.lastSrc) {
      this.lastSrc = this.src;
      this.loaded = false;
      this.error = false;
      this.cached = this.isCached(this.src);
    }

    if (!this.src) {
      this.error = true;
    }
  }

  public onLoad() {
    this.loaded = true;
    this.loading.next(false);
  }

  public onError() {
    this.error = true;
    this.loading.next(false);
  }

  private isCached(url: string): boolean {
    if (!url) {
      return false;
    }

    const image = new Image();
    image.src = url;

    return image.complete;
  }
}
