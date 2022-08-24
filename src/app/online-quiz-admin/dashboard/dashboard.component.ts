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

  data1: any;
  data2: any;

  constructor(private onlineQuizAdminService: OnlineQuizAdminService, private router: Router) { }

  ngOnInit(): void {
    this.counter = this.onlineQuizAdminService.getCounter().subscribe(res => this.counter = res)

    this.data1 = {
      labels: ['ผ่าน', 'ไม่ผ่าน'],

      datasets: [
        {
          data: [50, 100],
          backgroundColor: [
            "#36A2EB",
            "#FF6384"
          ],
          hoverBackgroundColor: [
            "#36A2EB",
            "#FF6384"
          ]
        }
      ]
    };

    this.data2 = {
      labels: ['ผ่าน', 'ไม่ผ่าน'],

      datasets: [
        {
          data: [10, 100],
          backgroundColor: [
            "#36A2EB",
            "#FF6384"
          ],
          hoverBackgroundColor: [
            "#36A2EB",
            "#FF6384"
          ]
        }
      ]
    };

  }

  gotoPage(name: string) {
    return this.router.navigate(['online-quiz/admin', name])
  }



}
