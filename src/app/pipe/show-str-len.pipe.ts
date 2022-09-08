import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showStrLen'
})
export class ShowStrLenPipe implements PipeTransform {

  transform(value: string): string {
    return value && value.length > 15 ? value.slice(0, 15) + '...' : value;
  }

}
