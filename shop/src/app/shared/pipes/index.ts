import { IncludesPipe } from './array.pipe';
import { SafePipe } from './safe.pipe';
import { ValuesPipe, ToArrayPipe, SearchPipe } from './object.pipe';
import { PhonePipe, NumberFormatPipe } from './number.pipe';
import { CurrencyPipe } from './currency.pipe';
import { FullDateTimePipe, ShortDateTimePipe } from './datetime.pipe';
import { FirstLetterPipe } from './first-letter.pipe';

export const SHARED_PIPES = [
  IncludesPipe,
  ValuesPipe,
  ToArrayPipe,
  SearchPipe,
  PhonePipe,
  NumberFormatPipe,
  FullDateTimePipe,
  ShortDateTimePipe,
  SafePipe,
  CurrencyPipe,
  FirstLetterPipe
];
