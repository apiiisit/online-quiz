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
      message: 'คุณแน่ใจหรือว่าต้องการลบหมวดหมู่ ' + category.categoryName + '?',
      header: 'ยืนยัน',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onlineQuizAdminService.deleteCategory(category).subscribe({
          complete: () => {
            this.refresh();
            this.onlineQuizAdminService.alertMsg('success', 'สำเร็จ', `ระบบลบหมวดหมู่ ${category.categoryName} สำเร็จแล้ว`);
          },
          error: () => {
            this.onlineQuizAdminService.alertMsg('error', 'ผิดพลาด', 'ระบบไม่สามารถลบได้เนื่องจากมีแบบทดสอบอยู่');
          }
        });
      }
    });
  }

  deleteSelectedItem() {
    this.confirmationService.confirm({
      message: 'คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่ที่เลือก?',
      header: 'ยืนยัน',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        [...this.selectedItem].forEach((item, index) => {

          setTimeout(() => {
            this.onlineQuizAdminService.deleteCategory(item).subscribe({
              complete: () => {
                if (index === this.selectedItem?.length - 1) {
                  this.refresh();
                  this.selectedItem = null;
                }
                this.onlineQuizAdminService.alertMsg('success', 'สำเร็จ', `ระบบลบหมวดหมู่ ${item.categoryName} สำเร็จแล้ว`);
              },
              error: () => {
                this.onlineQuizAdminService.alertMsg('error', 'ผิดพลาด', `ระบบไม่สามารถลบหมวดหมู่ ${item.categoryName} ได้เนื่องจากมีแบบทดสอบอยู่`);
              }
            })
          }, index * 200);

        })
      }
    });
  }

}
