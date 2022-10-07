import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { OnlineQuizService } from 'src/app/service/online-quiz.service';
import { QuizKeyService } from 'src/app/service/quiz-key.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  quizList: any[] = [];
  emptyList: boolean = false;
  params: any;

  constructor(
    private onlineQuizService: OnlineQuizService,
    private activeRoute: ActivatedRoute,
    private authService: AuthService,
    private quizKeyService: QuizKeyService
  ) { }

  ngOnInit(): void {

    this.onlineQuizService.clearQuizKey();

    this.params = this.activeRoute.snapshot.params;
    this.onlineQuizService.getQuiz(this.params.categoryId).subscribe(res => {
      if (res.length > 0) {
        const _res = [...res];
        _res.map(item => {
          item['quizStart'] = item['quizStart'].slice(0, -5);
          item['quizEnd'] = item['quizEnd'].slice(0, -5);
          this.onlineQuizService.getUserDoQuiz(this.authService.user.userId, item.quizId).subscribe({
            next: (res: any) => item['status'] = res.length > 0,
            complete: () => this.quizList = _res
          });
        })

      } else {
        this.emptyList = true;
      }
    });
  }

  checkEndTime(endTime: Date) {
    const dateNow = new Date().getTime();
    const end = new Date(endTime).getTime();
    return (dateNow > end);
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

  btnClick(status: boolean, q: any) {
    if (status) return;
    if (this.checkTime(q.quizStart, q.quizEnd)) {
      this.quiz = q;
      // showDialog
      this.title = q.quizName;
      this.display = true;

    }
  }

  showStatus(quizStatus: boolean, endTime: Date) {
    let status = '...';
    if (quizStatus) {
      status = 'ทำแบบทดสอบแล้ว';
    } else if (this.checkEndTime(endTime)) {
      status = 'หมดสิทธิ์ทำแบบทดสอบ';
    } else {
      status = 'ยังไม่ได้ทำแบบทดสอบ';
    }
    return status;
  }

  checkPassword() {
    this.submitted = true;
    if (this.password) {

      const quiz = {
        quizId: this.quiz.quizId,
        quizPassword: this.password
      }

      this.onlineQuizService.quizAuth(quiz).subscribe(res => {
        if (res) {
          this.quizKeyService.postQuizKey();

          window.location.href = `/online-quiz/quiz/${this.params.categoryId}/${this.quiz.quizId}`

          this.quiz = {};
          this.display = false;
        } else {
          this.cPassword = true;
        }
      })
    }
  }

  closeDialog() {
    this.display = false;
    this.cPassword = false;
    this.submitted = false;
    this.quiz = {};
  }

}
