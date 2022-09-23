import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { OnlineQuizAdminService } from 'src/app/service/online-quiz-admin.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  dialog: boolean = false;
  modeDialog: boolean = false;

  userList: any[] = [];
  userRoleList: any[] = [];
  user?: any;
  selectedItem?: any;
  submitted: boolean = false;

  constructor(private onlineQuizAdminService: OnlineQuizAdminService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.onlineQuizAdminService.getUser().subscribe(res => {
      const _res = [...res];
      _res.map(item => {
        if (item['lastLogin']) item['lastLogin'] = item['lastLogin'].slice(0, -5);
      })
      this.userList = _res;
    });
    this.userRoleList = [
      {
        userRoleId: 1,
        userRoleName: 'A',
        userRoleDescription: 'admin'
      },
      {
        userRoleId: 2,
        userRoleName: 'U',
        userRoleDescription: 'user'
      },
    ]
  }

  refresh() {
    this.user = {};
    this.ngOnInit();
  }

  editItem(user: any) {
    this.user = { ...user };
    this.modeDialog = true;
    this.dialog = false;
    setTimeout(() => this.dialog = true);
  }

  deleteItem(user: any) {
    this.confirmationService.confirm({
      message: 'คุณแน่ใจหรือว่าต้องการลบ ' + user.userName + '?',
      header: 'ยืนยัน',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onlineQuizAdminService.deleteUser(user).subscribe({
          complete: () => {
            this.refresh();
            this.onlineQuizAdminService.alertMsg('success', 'สำเร็จ', `ระบบลบผู้ใช้ ${user.userName} สำเร็จแล้ว`);
          },
          error: () => {
            this.onlineQuizAdminService.alertMsg('error', 'ผิดพลาด', 'มีบางอย่างผิดพลาด');
          }
        });
      }
    });
  }

  deleteSelectedItem() {
    this.confirmationService.confirm({
      message: 'คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ที่เลือก?',
      header: 'ยืนยัน',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        [...this.selectedItem].forEach((item, index) => {

          setTimeout(() => {
            this.onlineQuizAdminService.deleteUser(item).subscribe({
              complete: () => {
                if (index === this.selectedItem?.length - 1) {
                  this.refresh();
                  this.selectedItem = null;
                }
                this.onlineQuizAdminService.alertMsg('success', 'สำเร็จ', `ระบบลบผู้ใช้ ${item.userName} สำเร็จแล้ว`);
              },
              error: () => {
                this.onlineQuizAdminService.alertMsg('error', 'ผิดพลาด', `ระบบไม่สามารถลบผู้ใช้ ${item.userName} ได้`);
              }
            })
          }, index * 200);

        })
      }
    });
  }

}
