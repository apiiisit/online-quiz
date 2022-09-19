import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { OnlineQuizAdminService } from 'src/app/service/online-quiz-admin.service';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss']
})
export class CategoryManagementComponent implements OnInit {

  dialog: boolean = false;
  modeDialog: boolean = false;
  categoryList: any[] = [];
  category?: any;
  selectedItem?: any;
  submitted: boolean = false;

  constructor(private onlineQuizAdminService: OnlineQuizAdminService, private confirmationService: ConfirmationService, private router: Router) { }

  ngOnInit(): void {
    this.onlineQuizAdminService.getCategory().subscribe(res => this.categoryList = res);
  }

  refresh() {
    this.category = {};
    setTimeout(() => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['online-quiz/management', 'category'])
      });
    }, 1000)
  }

  editItem(category: any) {
    this.category = { ...category };
    this.modeDialog = true;
    this.dialog = false;
    setTimeout(() => this.dialog = true);
  }

  deleteItem(category: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + category.categoryName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onlineQuizAdminService.deleteCategory(category).subscribe({
          complete: () => {
            this.refresh();
            this.onlineQuizAdminService.alertMsg('success', 'Successful', 'Category deleted');
          },
          error: () => {
            this.onlineQuizAdminService.alertMsg('error', 'Error', 'Category delete error');
          }
        });
      }
    });
  }

  deleteSelectedItem() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected category?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        [...this.selectedItem].forEach((item, index) => {
          this.onlineQuizAdminService.deleteCategory(item).subscribe({
            complete: () => {
              if (index === this.selectedItem?.length - 1) {
                this.refresh();
                this.selectedItem = null;
              }
              this.onlineQuizAdminService.alertMsg('success', 'Successful', `Category ${item.userName} deleted`);
            },
            error: () => {
              this.onlineQuizAdminService.alertMsg('error', 'Error', `Category ${item.userName} delete error`);
            }
          })
        })
      }
    });
  }

}
