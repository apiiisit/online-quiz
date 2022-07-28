import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OnlineQuizService } from 'src/app/service/online-quiz.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  categoryList: any[] = [];

  constructor(private onlineQuizService: OnlineQuizService, private router: Router) { }

  ngOnInit(): void {
    this.onlineQuizService.getCategory().subscribe(res => this.categoryList = res);
  }

  gotoQuiz(id: number) {
    return this.router.navigate(['/online-quiz/quiz', id])
  }

}
