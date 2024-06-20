import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertToPercentage',
  standalone: true,
})
export class ConvertToPercentage implements PipeTransform {
  transform(value: number): string {
    return value.toFixed(1) + '%';
  }
}
