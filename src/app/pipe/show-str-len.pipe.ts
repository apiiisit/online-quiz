import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showStrLen'
})
export class ShowStrLenPipe implements PipeTransform {

  transform(value: string): string {
    return value.length <= 15 ? value : value.slice(0, 15) + '...'
  }

}
