import {Directive, Input, HostBinding} from '@angular/core';
@Directive({
    selector: 'img[img-no-available]',
    host: {
      '(error)': 'updateUrl()',
      '(load)': 'load()',
      '[src]': 'src'
     }
  })
 export class ImageNoAvailableDirective {
    @Input() src: string;
    @Input() default: string;
    @HostBinding('class') className: string;

    updateUrl(): void {
      this.src = this.default ? this.default : 'assets/img/No_image_available.svg.png';
    }

    load(): void {
      this.className += ' image-loaded';
    }
  }
