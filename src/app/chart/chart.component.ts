import { Component, Input, OnInit } from '@angular/core';
import { OnlineQuizAdminService } from '../service/online-quiz-admin.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  @Input() data?: number;
  dataChart: any;

  constructor(private onlineQuizAdminService: OnlineQuizAdminService) { }

  ngOnInit(): void {

    this.onlineQuizAdminService.getCounterChart(this.data!).subscribe(res => {
      this.dataChart = {
        labels: ['ผ่าน', 'ไม่ผ่าน'],
        datasets: [
          {
            data: [res.taskPass, res.taskFail],
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
      }

    })

  }

}
