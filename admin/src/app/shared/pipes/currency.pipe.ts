import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '@env/environment';

@Pipe({ name: 'formatCurrency' })
export class CurrencyPipe implements PipeTransform {
  transform = (value: number): string => currencyFormatter(value, environment.currency);
}

const currencyFormatter = (value: number, countryCode: string) => {
	switch(countryCode) {
		case 'vn': {
			const format = new Intl.NumberFormat([], {
				minimumFractionDigits: 0
			}).format(Number(value) / 1e3);
		
			return `${format}K VNĐ`;
		}
		case 'sgp': {
			const format = new Intl.NumberFormat([], {
				minimumFractionDigits: 2
			}).format(Number(value));
		
			return `$${format} SGD`;
		}
		default: {
			const format = new Intl.NumberFormat([], {
				minimumFractionDigits: 2
			}).format(Number(value));
		
			return `$${format}`;
		}
	}
}
