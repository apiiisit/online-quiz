import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OnlineQuizAdminService } from 'src/app/service/online-quiz-admin.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  counter: any;
  quizList: any;
  showDisplay: boolean = false;

  constructor(private onlineQuizAdminService: OnlineQuizAdminService, private router: Router) { }

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
  }

  gotoPage(name: string) {
    return this.router.navigate(['online-quiz/admin', name])
  }





}
