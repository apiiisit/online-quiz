import { Component, OnInit } from '@angular/core';
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

  constructor(private onlineQuizAdminService: OnlineQuizAdminService) { }

  ngOnInit(): void {

    this.onlineQuizAdminService.getTask().subscribe(res => {
      const _res = [...res];
      _res.map(itemTask => {
        itemTask['fullName'] = `${itemTask.user.firstName} ${itemTask.user.lastName}`;
        itemTask['time'] = this.calTime(itemTask.taskStart.slice(0, -5), itemTask.taskFinish.slice(0, -5));
      })
      this.taskList = _res;
    });

  }

  search(dt: any) {
    dt.filterGlobal(this.searchText, 'contains')
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

}
