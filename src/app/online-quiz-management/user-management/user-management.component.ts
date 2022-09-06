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
    this.dialog = false;
    setTimeout(() => this.dialog = true);
  }
  
  deleteItem(user: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + user.userName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onlineQuizAdminService.deleteUser(user).subscribe({
          complete: () => {
            this.refresh();
            this.onlineQuizAdminService.alertMsg('success', 'Successful', 'User deleted');
          },
          error: () => {
            this.onlineQuizAdminService.alertMsg('error', 'Error', 'User delete error');
          }
        });
      }
    });
  }

  deleteSelectedItem() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected user?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        [...this.selectedItem].forEach((item, index) => {
          this.onlineQuizAdminService.deleteUser(item).subscribe({
            complete: () => {
              if (index === this.selectedItem?.length - 1) {
                this.refresh();
                this.selectedItem = null;
              }
              this.onlineQuizAdminService.alertMsg('success', 'Successful', `User ${item.userName} deleted`);
            },
            error: () => {
              this.onlineQuizAdminService.alertMsg('error', 'Error', `User ${item.userName} delete error`);
            }
          })
        })
      }
    });
  }

}
