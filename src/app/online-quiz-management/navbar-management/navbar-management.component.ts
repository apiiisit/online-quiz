import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/service/auth.service';
import { OnlineQuizService } from 'src/app/service/online-quiz.service';

@Component({
  selector: 'app-navbar-management',
  templateUrl: './navbar-management.component.html',
  styleUrls: ['./navbar-management.component.scss']
})
export class NavbarManagementComponent implements OnInit {
  btnShow!: string;
  items!: MenuItem[];
  
  fullName!: string;
  imageSrc: any;

  dialogQuiz: boolean = false;
  dialogCategory: boolean = false;
  dialogUser: boolean = false;

  constructor(private router: Router, private authService: AuthService, private onlineQuizService: OnlineQuizService) { }

  ngOnInit(): void {

    this.imageSrc = this.authService.profileUrl;
    this.onlineQuizService.getUser(this.authService.user.userId).subscribe(res => {
      this.fullName = `${res.firstName} ${res.lastName}`;
    })

    this.btnShow = this.filterPath(this.router.url)

    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.btnShow = this.filterPath(event.url)
      }
    })

    this.items = [
      {
        label: 'ตัวเลือก',
        items: [
          {
            label: 'แก้ไขข้อมูลส่วนตัว',
            icon: 'pi pi-user-edit',
            routerLink: 'edit/profile'
          },
          {
            label: 'เปลี่ยนรหัสผ่าน',
            icon: 'pi pi-lock',
            routerLink: 'edit/password'
          },
          {
            separator: true
          },
          {
            label: 'ออกจากระบบ',
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
