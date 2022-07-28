import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'choice'
})
export class ChoicePipe implements PipeTransform {

  transform(value: string): string {
    let choiceType = '-';
    switch (value) {
      case 'S':
        choiceType = 'Single choice';
        break;
      case 'M':
        choiceType = 'Multi choice';
        break;
    }
    return choiceType;
  }

}
