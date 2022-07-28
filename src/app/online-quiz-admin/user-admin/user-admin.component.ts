import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { OnlineQuizAdminService } from 'src/app/service/online-quiz-admin.service';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.scss']
})
export class UserAdminComponent implements OnInit {

  searchText?: string;

  dialog: boolean = false;
  userList: any[] = [];
  userRoleList: any[] = [];
  user?: any;
  selectedItem?: any;
  submitted: boolean = false;

  constructor(private onlineQuizAdminService: OnlineQuizAdminService, private router: Router, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {

    this.onlineQuizAdminService.getUser().subscribe(res => this.userList = res);
    this.onlineQuizAdminService.getUserRole().subscribe(res => this.userRoleList = res);

  }

  search(dt: any) {
    dt.filterGlobal(this.searchText, 'contains')
  }

  refresh() {
    this.user = {};
    this.ngOnInit();
  }

  openNew() {
    this.user = {};
    this.submitted = false;
    this.dialog = true;
  }

  hideDialog() {
    this.dialog = false;
    this.submitted = false;
  }

  editItem(user: any) {
    this.user = { ...user };
    this.dialog = true;
  }

  saveItem() {
    this.submitted = true;
    const userName = this.user.userName?.trim();
    const password = this.user.password?.trim();
    const firstName = this.user.firstName?.trim();
    const lastName = this.user.lastName?.trim();
    const tel = this.user.tel?.trim();
    const email = this.user.email?.trim();
    const role = this.user.userRole;
    if (userName && password && firstName && lastName && tel && email && role) {
      if (this.user.userId) {
        this.saveToDatabase(this.user);
      }
      else {
        this.onlineQuizAdminService.newUser(this.user).subscribe({
          complete: () => {
            this.refresh();
            this.onlineQuizAdminService.alertMsg('success', 'Successful', 'User created');
          },
          error: () => {
            this.onlineQuizAdminService.alertMsg('error', 'Error', 'User create error');
          }
        });
      }
      this.dialog = false;
    }
  }

  saveToDatabase(user: any) {
    this.onlineQuizAdminService.updateUser(user).subscribe({
      complete: () => {
        this.refresh();
        this.onlineQuizAdminService.alertMsg('success', 'Successful', 'User updated');
      },
      error: () => {
        this.onlineQuizAdminService.alertMsg('error', 'Error', 'User update error');
      }
    });
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
