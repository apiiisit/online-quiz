import { Component, Input, OnInit } from '@angular/core';
import { OnlineQuizAdminService } from 'src/app/service/online-quiz-admin.service';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent implements OnInit {

  @Input() dialog: boolean = false;
  @Input() mode: boolean = false;
  @Input() category: any = {};
  submitted: boolean = false;

  constructor(private onlineQuizAdminService: OnlineQuizAdminService) { }

  ngOnInit(): void {
  }

  refresh() {
    this.category = {};
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  hideDialog() {
    this.dialog = false;
    this.submitted = false;
  }

  saveItem() {
    this.submitted = true;
    const name = this.category.categoryName?.trim();
    if (name && name.length > 5) {
      if (this.category.categoryId) {
        this.saveToDatabase(this.category);
      }
      else {
        this.category.categoryActive = this.category.categoryActive ? true : false;
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

}
