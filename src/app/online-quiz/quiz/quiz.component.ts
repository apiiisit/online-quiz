import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnlineQuizService } from 'src/app/service/online-quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  quizList: any[] = [];
  emptyList: boolean = false;
  params: any;

  constructor(private onlineQuizService: OnlineQuizService, private activeRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.params = this.activeRoute.snapshot.params;
    this.onlineQuizService.getQuiz(this.params.categoryId).subscribe(res => {
      if (res.length > 0) {
        const _res = [...res];
        _res.map(item => {
          item['quizStart'] = item['quizStart'].slice(0, -5);
          item['quizEnd'] = item['quizEnd'].slice(0, -5);
        })
        this.quizList = _res;
      } else {
        this.emptyList = true;
      }
    });
  }

  checkStartTime(startTime: Date) {
    const dateNow = new Date().getTime();
    const start = new Date(startTime).getTime();
    return (dateNow > start);
  }

  checkTime(startTime: Date, endTime: Date) {
    const dateNow = new Date().getTime();
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    return (start <= dateNow && dateNow <= end);
  }

  display: boolean = false;
  title!: string;
  quiz!: any;
  password!: string;
  cPassword: boolean = false;
  submitted: boolean = false;

  btnClick(q: any) {
    if (this.checkTime(q.quizStart, q.quizEnd)) {
      this.quiz = q;
      // showDialog
      this.title = q.quizName;
      this.display = true;

    }
  }

  checkPassword() {
    this.submitted = true;
    if (this.password) {
      if (this.password === this.quiz.quizPassword) {
        this.router.navigate(['/online-quiz/quiz/', this.params.categoryId, this.quiz.quizId])
        this.quiz = {};
        this.display = false;

      } else {
        this.cPassword = true;
      }
    }
  }

  closeDialog() {
    this.display = false;
    this.cPassword = false;
    this.submitted = false;
    this.quiz = {};
  }

}
