import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { OnlineQuizAdminService } from 'src/app/service/online-quiz-admin.service';

@Component({
  selector: 'app-result-management',
  templateUrl: './result-management.component.html',
  styleUrls: ['./result-management.component.scss']
})
export class ResultManagementComponent implements OnInit {

  taskList: any[] = [];
  selectedItem?: any;

  categoryList: any;
  quizList: any;

  categorySelected: any;
  quizSelected: any;
  statusSelected: any;


  constructor(private onlineQuizAdminService: OnlineQuizAdminService, private router: Router, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.onlineQuizAdminService.getTask().subscribe(res => {
      this.taskList = this.mapTask(res);
    });

    this.onlineQuizAdminService.getCategory().subscribe(res => this.categoryList = res);
    this.onlineQuizAdminService.getQuiz().subscribe(res => this.quizList = res);
  }

  refresh() {
    this.ngOnInit();
  }

  mapTask(res: any) {
    res.map((itemTask: any) => {
      itemTask['fullName'] = `${itemTask.user.firstName} ${itemTask.user.lastName}`;
      itemTask['time'] = this.calTime(itemTask.taskStart.slice(0, -5), itemTask.taskFinish.slice(0, -5));
    })
    return res;
  }

  filter() {
    const categoryId = this.categorySelected?.categoryId
    const quizId = this.quizSelected?.quizId
    let status;

    if (this.statusSelected && this.statusSelected.length == 1) {
      status = (this.statusSelected[0] == 'Active').toString()
    } else {
      status = null;
    }

    const query = [];
    if (categoryId) query.push(`categoryId=${categoryId}`)
    if (quizId) query.push(`quizId=${quizId}`)
    if (status) query.push(`status=${status}`)

    this.onlineQuizAdminService.getTaskFilter(query.join('&')).subscribe(res => this.taskList = this.mapTask(res));
  }

  calTime(start: number, finish: number) {
    const diff = new Date(finish).getTime() - new Date(start).getTime();

    let msec = diff;
    const hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;

    const mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;

    const ss = Math.floor(msec / 1000);
    msec -= ss * 1000;

    return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
  }

  deleteItem(task: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + task.fullName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onlineQuizAdminService.deleteTask(task).subscribe({
          complete: () => {
            this.refresh();
            this.onlineQuizAdminService.alertMsg('success', 'Successful', 'Task deleted');
          },
          error: () => {
            this.onlineQuizAdminService.alertMsg('error', 'Error', 'Task delete error');
          }
        });
      }
    });
  }

  deleteSelectedItem() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected result?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        [...this.selectedItem].forEach((item, index) => {
          this.onlineQuizAdminService.deleteTask(item).subscribe({
            complete: () => {
              if (index === this.selectedItem?.length - 1) {
                this.refresh();
                this.selectedItem = null;
              }
              this.onlineQuizAdminService.alertMsg('success', 'Successful', `Task ${item.fullName} deleted`);
            },
            error: () => {
              this.onlineQuizAdminService.alertMsg('error', 'Error', `Task ${item.fullName} delete error`);
            }
          })
        })
      }
    });
  }

}
