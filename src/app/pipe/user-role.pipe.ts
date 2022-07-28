import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userRole'
})
export class UserRolePipe implements PipeTransform {

  transform(value: string): string {
    let userRole = '-';
    switch (value) {
      case 'A':
        userRole = 'Admin';
        break;
      case 'U':
        userRole = 'User';
        break;
    }
    return userRole;
  }

}
