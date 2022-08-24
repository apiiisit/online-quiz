import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { OnlineQuizAdminService } from 'src/app/service/online-quiz-admin.service';

@Component({
  selector: 'app-category-admin',
  templateUrl: './category-admin.component.html',
  styleUrls: ['./category-admin.component.scss']
})
export class CategoryAdminComponent implements OnInit {

  searchText?: string;

  dialog: boolean = false;
  categoryList: any[] = [];
  category?: any;
  selectedItem?: any;
  submitted: boolean = false;

  constructor(private onlineQuizAdminService: OnlineQuizAdminService, private router: Router, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.onlineQuizAdminService.getCategory().subscribe(res => this.categoryList = res);
  }

  search(dt: any) {
    dt.filterGlobal(this.searchText, 'contains')
  }

  refresh() {
    this.category = {};
    this.ngOnInit();
  }

  goPageByName(name: string) {
    this.router.navigate(['/online-quiz/admin/', 'quiz'], {
      queryParams: { name: name }
    })
  }

  openNew() {
    this.category = {};
    this.submitted = false;
    this.dialog = true;
  }

  hideDialog() {
    this.dialog = false;
    this.submitted = false;
  }

  editItem(category: any) {
    this.category = { ...category };
    this.dialog = true;
  }

  saveItem() {
    this.submitted = true;
    const name = this.category.categoryName?.trim();
    if (name) {
      if (this.category.categoryId) {
        this.saveToDatabase(this.category);
      }
      else {
        this.onlineQuizAdminService.newCategory(this.category).subscribe({
          complete: () => {
            this.refresh();
            this.onlineQuizAdminService.alertMsg('success', 'Successful', 'Category created');
          },
          error: () => {
            this.onlineQuizAdminService.alertMsg('error', 'Error', 'Category create error');
          }
        });
      }
      this.dialog = false;
    }
  }

  saveToDatabase(category: any) {
    this.onlineQuizAdminService.updateCategory(category).subscribe({
      complete: () => {
        this.refresh();
        this.onlineQuizAdminService.alertMsg('success', 'Successful', 'Category updated');
      },
      error: () => {
        this.onlineQuizAdminService.alertMsg('error', 'Error', 'Category update error');
      }
    });
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
              this.onlineQuizAdminService.alertMsg('success', 'Successful', `Category ${item.categoryName} deleted`);
            },
            error: () => {
              this.onlineQuizAdminService.alertMsg('error', 'Error', `Category ${item.categoryName} delete error`);
            }
          })
        })
      }
    });
  }

  activeSwitch(category: any, index: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to switch ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.saveToDatabase(category);
      },
      reject: () => {
        this.categoryList[index].categoryActive = !this.categoryList[index].categoryActive
      }
    });
  }

}
