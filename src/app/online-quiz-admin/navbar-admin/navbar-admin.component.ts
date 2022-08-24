import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.scss']
})
export class NavbarAdminComponent implements OnInit {

  items: MenuItem[] = [];
  styleConfig: any = {};

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {

    this.styleConfig = {
      'background-color': '',
      'font-weight': 'bold',
      'font-size': 'large'
    }

    this.items = [
      {
        label: 'Category',
        icon: 'pi pi-fw pi-file',
        command: () => {
          this.router.navigateByUrl('/online-quiz', { skipLocationChange: true }).then(() =>
            this.router.navigate(['/online-quiz/admin', 'category'])
          )
        }
      },
      {
        label: 'Quiz',
        icon: 'pi pi-fw pi-file',
        command: () => {
          this.router.navigateByUrl('/online-quiz', { skipLocationChange: true }).then(() =>
            this.router.navigate(['/online-quiz/admin/', 'quiz'])
          )
        }
      },
      {
        label: 'Question',
        icon: 'pi pi-fw pi-file',
        command: () => {
          this.router.navigateByUrl('/online-quiz', { skipLocationChange: true }).then(() =>
            this.router.navigate(['/online-quiz/admin/', 'question'])
          )
        }
      },
      {
        label: 'Score detail',
        icon: 'pi pi-fw pi-file',
        command: () => {
          this.router.navigateByUrl('/online-quiz', { skipLocationChange: true }).then(() =>
            this.router.navigate(['/online-quiz/admin/', 'score'])
          )
        }
      },
      {
        label: 'User',
        icon: 'pi pi-fw pi-file',
        command: () => {
          this.router.navigateByUrl('/online-quiz', { skipLocationChange: true }).then(() =>
            this.router.navigate(['/online-quiz/admin/', 'user'])
          )
        }
      },
      {
        label: 'Logout',
        icon: 'pi pi-fw pi-power-off',
        command: () => {
          this.authService.logout();
          this.router.navigate(['']);
        }
      }
    ];

    const path = this.router.url.split('/');
    let pathName = path[path.length - 1].split('?')[0];
    const index = this.items.findIndex(item => item.label?.toLowerCase().includes(pathName));
    if (index > -1) this.items[index]['style'] = this.styleConfig;
  }

  goHome() {
    this.router.navigate(['/online-quiz/admin']);
  }

}
