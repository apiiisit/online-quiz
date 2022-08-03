import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private onlineQuizAdminService: OnlineQuizAdminService, private router: Router) { }

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

  search(dt: any) {
    let txt = this.searchText!.toLowerCase();
    if (txt.includes('not')) txt = 'false';
    else if (txt.includes('pass')) txt = 'true';
    
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

}
