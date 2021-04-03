import { Injector, Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({ name: 'dynamic' })
export class DynamicPipe implements PipeTransform {
  public constructor(
    private injector: Injector,
    private currencyPipe: CurrencyPipe,
  ) { }

  transform(value: any, pipeToken: any, pipeArgs: any[] = []): any {
    if (!pipeToken) {
      return value;
    }
    else {
      const pipe = this.injector.get(pipeToken);
      let result = pipe.transform(value);
      if (pipeArgs.length) {
        result = pipe.transform(value, ...pipeArgs);
      }

      return result;
    }
  }
}
