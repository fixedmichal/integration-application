import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appOnlyNumericValues]',
  standalone: true,
})
export class OnlyNumericValuesDirective {
  @Input() additionalKeys: string[] = [];
  @HostListener('keydown', ['$event']) onKeyDown(e: KeyboardEvent) {
    const allowedKeys = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'Backspace',
      'Delete',
      ...this.additionalKeys,
    ];

    if (allowedKeys.includes(e.key)) {
      return true;
    }

    return false;
  }
}
