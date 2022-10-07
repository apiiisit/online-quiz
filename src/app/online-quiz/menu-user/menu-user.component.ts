import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/service/auth.service';
import { OnlineQuizService } from 'src/app/service/online-quiz.service';
import { QuizKeyService } from 'src/app/service/quiz-key.service';

@Component({
  selector: 'app-menu-user',
  templateUrl: './menu-user.component.html',
  styleUrls: ['./menu-user.component.scss']
})
export class MenuUserComponent implements OnInit {

  constructor(
    private quizKeyService: QuizKeyService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private onlineQuizService: OnlineQuizService,
    private authService: AuthService
  ) { }

  items!: MenuItem[];
  showMenu: boolean = false;

  ngOnInit() {

    this.items = [
      {
        label: 'หน้าหลัก',
        command: () => this.sendRouterLink('/online-quiz')
      },
      {
        label: 'User profile',
        expanded: true,
        items: [
          {
            label: 'แก้ไขข้อมูลส่วนตัว',
            icon: 'pi pi-fw pi-pencil',
            command: () => this.sendRouterLink('/online-quiz/edit/profile')
          },
          {
            label: 'เปลี่ยนรหัสผ่าน',
            icon: 'pi pi-fw pi-lock',
            command: () => this.sendRouterLink('/online-quiz/edit/password')
          },
          {
            label: 'ออกจากระบบ',
            icon: 'pi pi-power-off',
            command: (() => {
              this.confirmLogout()
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
      this.items[1].label = `${res.firstName} ${res.lastName}`;
      this.onlineQuizService.getCategory().subscribe({
        next: (res) => {
          [...res].forEach(item => {
            this.items[2].items!.push({
              label: item.categoryName,
              command: (() => {
                this.sendRouterLink(`/online-quiz/quiz/${item.categoryId}`, 're')
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

  sendRouterLink(url: string, mode?: string) {

    if (this.quizKeyService.quizKey) {
      this.confirmationService.confirm({
        message: 'คุณต้องการออกจากหน้านี้หรือไม่',
        header: 'ยืนยัน',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          if (mode) {
            this.router.navigateByUrl('/online-quiz', { skipLocationChange: true }).then(() => this.router.navigateByUrl(url))
          } else {
            this.router.navigateByUrl(url);
          }
        }
      });
    } else {
      if (mode) {
        this.router.navigateByUrl('/online-quiz', { skipLocationChange: true }).then(() => this.router.navigateByUrl(url))
      } else {
        this.router.navigateByUrl(url);
      }
    }

  }

  confirmLogout() {
    this.confirmationService.confirm({
      message: 'คุณต้องการออกจากระบบหรือไม่',
      header: 'ยืนยัน',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.authService.logout();
        this.messageService.add({ severity: 'success', summary: 'ออกจากระบบ', detail: 'ออกจากระบบสำเร็จ', life: 1000 });
        setTimeout(() => {
          this.router.navigate(['']);
        }, 2000);
      }
    });
  }

}
