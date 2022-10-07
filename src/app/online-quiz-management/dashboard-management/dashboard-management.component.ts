import { Component, OnInit } from '@angular/core';
import { OnlineQuizAdminService } from 'src/app/service/online-quiz-admin.service';

@Component({
  selector: 'app-dashboard-management',
  templateUrl: './dashboard-management.component.html',
  styleUrls: ['./dashboard-management.component.scss']
})
export class DashboardManagementComponent implements OnInit {

  counter: any;
  quizList: any;
  showDisplay: boolean = false;
  cardStyle: any;

  constructor(private onlineQuizAdminService: OnlineQuizAdminService) { }

  ngOnInit(): void {
    this.onlineQuizAdminService.getCounter().subscribe({
      next: (res) => {
        this.counter = res
      },
      complete: () => {
        this.showDisplay = true;
      }
    })
    this.onlineQuizAdminService.getQuizCheck().subscribe(res => this.quizList = res)

    this.cardStyle = {'width': '15rem', 'margin-bottom': '2em', 'height': '10rem'}
  }

  gotoPage(name: string) {
    return window.location.href = `online-quiz/management/${name}`
  }

}
