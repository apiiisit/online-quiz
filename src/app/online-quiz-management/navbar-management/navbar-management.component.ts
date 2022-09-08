import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-navbar-management',
  templateUrl: './navbar-management.component.html',
  styleUrls: ['./navbar-management.component.scss']
})
export class NavbarManagementComponent implements OnInit {
  btnShow!: string;
  items!: MenuItem[];
  num!: number;

  dialogQuiz: boolean = false;
  dialogCategory: boolean = false;
  dialogUser: boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {

    this.btnShow = this.filterPath(this.router.url)

    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.btnShow = this.filterPath(event.url)
      }
    })

    this.items = [
      {
        label: 'Options',
        items: [
          {
            label: 'Edit profile',
            icon: 'pi pi-user-edit'
          },
          {
            label: 'Change password',
            icon: 'pi pi-lock',
          },
          {
            separator: true
          },
          {
            label: 'Logout',
            icon: 'pi pi-fw pi-sign-out',
            command: () => {
              this.authService.logout();
              this.router.navigate(['']);
            }
          }
        ]
      }
    ]

  }

  filterPath(url: string) {
    const arrPath = url.split('/')
    return arrPath[arrPath.length - 1]
  }

  openDialogQuiz() {
    this.dialogQuiz = false;
    setTimeout(() => this.dialogQuiz = true);
  }

  openDialogCategory() {
    this.dialogCategory = false;
    setTimeout(() => this.dialogCategory = true);
  }

  openDialogUser() {
    this.dialogUser = false;
    setTimeout(() => this.dialogUser = true);
  }

}
