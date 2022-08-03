import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/service/auth.service';
import { OnlineQuizService } from 'src/app/service/online-quiz.service';

@Component({
  selector: 'app-menu-user',
  templateUrl: './menu-user.component.html',
  styleUrls: ['./menu-user.component.scss']
})
export class MenuUserComponent implements OnInit {

  constructor(private router: Router, private onlineQuizService: OnlineQuizService, private authService: AuthService) { }

  items!: MenuItem[];
  showMenu: boolean = false;

  ngOnInit() {

    this.items = [
      {
        label: 'หน้าหลัก',
        routerLink: `/online-quiz/`
      },
      {
        label: 'User profile',
        expanded: true,
        items: [
          {
            label: 'แก้ไขข้อมูลส่วนตัว',
            icon: 'pi pi-fw pi-pencil',
            routerLink: 'edit/profile'
          },
          {
            label: 'ออกจากระบบ',
            icon: 'pi pi-power-off',
            command: (() => {
              this.authService.logout();
              this.router.navigate(['']);
            })
          }
        ]
      },
      {
        label: 'วิชาเรียนของฉัน',
        expanded: true,
        items: []
      }
    ];

    this.onlineQuizService.getUser(this.authService.user.userId).subscribe(res => {
      this.items![1].label = `${res.firstName} ${res.lastName}`
      this.onlineQuizService.getCategory().subscribe({
        next: (res) => {
          [...res].forEach(item => {
            this.items[2].items!.push({
              label: item.categoryName,
              command: (() => {
                this.router.navigateByUrl('/online-quiz', { skipLocationChange: true }).then(() =>
                  this.router.navigate(['/online-quiz/quiz', item.categoryId])
                )
              })
            })
          })
        },
        complete: () => {
          this.showMenu = true;
        }
      })
    })

  }

}
