import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-online-quiz-management',
  templateUrl: './online-quiz-management.component.html',
  styleUrls: ['./online-quiz-management.component.scss']
})
export class OnlineQuizManagementComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void { }

  goHome() {
    this.router.navigate(['online-quiz', 'management'])
  }

}
