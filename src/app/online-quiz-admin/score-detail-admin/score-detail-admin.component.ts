import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { OnlineQuizAdminService } from 'src/app/service/online-quiz-admin.service';

@Component({
  selector: 'app-score-detail-admin',
  templateUrl: './score-detail-admin.component.html',
  styleUrls: ['./score-detail-admin.component.scss']
})
export class ScoreDetailAdminComponent implements OnInit {

  searchText?: string;

  taskList: any[] = [];
  selectedItem?: any;

  constructor(private onlineQuizAdminService: OnlineQuizAdminService, private router: Router, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {

    this.onlineQuizAdminService.getTask().subscribe(res => {
      const _res = [...res];
      _res.map(itemTask => {
        itemTask['fullName'] = `${itemTask.user.firstName} ${itemTask.user.lastName}`;
        itemTask['time'] = this.calTime(itemTask.taskStart.slice(0, -5), itemTask.taskFinish.slice(0, -5));
      })
      this.taskList = _res;
    });

    const quiz = this.router.url.split('=')[1];
    if (quiz) this.searchText = decodeURI(quiz);

  }

  refresh() {
    this.ngOnInit();
  }

  search(dt: any) {
    let txt = this.searchText?.toLowerCase();
    if (txt?.includes('not')) txt = 'false';
    else if (txt?.includes('pass')) txt = 'true';
    
    dt.filterGlobal(txt, 'contains')
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
      message: 'Are you sure you want to delete the selected user?',
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
