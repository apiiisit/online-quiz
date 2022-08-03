import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { interval } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { OnlineQuizService } from 'src/app/service/online-quiz.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  currentPage: number = 0;

  quizName!: string;
  quizPass!: number;
  questionList: any[] = [];
  questionType: string[] = ['radio', 'checkbox'];
  questionTime!: number;
  selectedChoice: any[] = [];
  point: number = 0;
  btnText: string = 'ถัดไป';

  intervalTime$: any;
  intervalTimeOut$: any;

  timeText!: string;
  timeOut!: number;
  cTimeOut: boolean = false;

  progressbarValue: number = 100;
  questionTimeDisplay!: number;

  display: boolean = false;
  displayError: boolean = false;
  detail!: string;
  task: any = {};

  constructor(private onlineQuizService: OnlineQuizService, private messageService: MessageService, private activeRoute: ActivatedRoute, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    const params = this.activeRoute.snapshot.params;
    let timeAll;

    this.onlineQuizService.getQuizById(params['quizId']).subscribe(res => {

      res.quizStart = res.quizStart.slice(0, -5);
      res.quizEnd = res.quizEnd.slice(0, -5);

      if ((new Date(res.quizEnd).getTime() - new Date().getTime()) < 0) {
        this.router.navigate(['']);
        return
      }

      this.task['taskStart'] = new Date();
      this.task['quiz'] = { quizId: res.quizId };
      this.quizName = res.quizName;
      this.quizPass = res.quizPass;
      this.timeOut = res.quizEnd;

      const diff = new Date(res.quizEnd).getTime() - new Date(res.quizStart).getTime();
      timeAll = diff / 1000;

      this.onlineQuizService.getQuestion(params['quizId'], res.numberOfQuestion, timeAll).subscribe({
        next: (res) => {
          this.questionList = res;
          this.questionTime = this.questionList[0].questionTime;
        },
        complete: () => {
          this.startTime();
          this.startTimeOut();
        }
      })
    })

  }

  nextPage() {
    if (this.cTimeOut) return
    if (this.currentPage + 1 === this.questionList.length) {
      this.stopTime();
      this.stopTimeOut();
      this.answer();
      this.showDisplay('ยืนยันการส่งคำตอบ');
      return
    }
    this.stopTime();
    this.answer()
    this.currentPage++;
    this.currentPage + 1 === this.questionList.length ? this.btnText = 'ส่งคำตอบ' : null;
    this.questionTime = this.questionList[this.currentPage].questionTime;
    this.startTime();
  }

  startTime() {
    this.questionTimeDisplay = this.questionTime;
    this.intervalTime$ = interval(1000)
      .subscribe((sec) => {
        this.progressbarValue = 90 - sec * 90 / (this.questionTime - 1);
        if (this.questionTimeDisplay > 0) this.questionTimeDisplay--;
        if (sec == this.questionTime) {
          this.stopTime();
          this.nextPage();
        }
      })
  }

  stopTime() {
    this.progressbarValue = 100;
    this.intervalTime$.unsubscribe();
  }

  startTimeOut() {
    this.intervalTimeOut$ = interval(1000)
      .subscribe(() => {
        const diff = new Date(this.timeOut!).getTime() - new Date().getTime();

        let msec = diff;
        const hh = Math.floor(msec / 1000 / 60 / 60);
        msec -= hh * 1000 * 60 * 60;

        const mm = Math.floor(msec / 1000 / 60);
        msec -= mm * 1000 * 60;

        const ss = Math.floor(msec / 1000);
        msec -= ss * 1000;

        this.timeText = `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`

        if (hh === 0 && mm === 0 && ss === 0) {
          this.stopTime();
          this.stopTimeOut();
          this.answer();
          this.cTimeOut = true;
          this.showDisplay('คุณหมดเวลาทำแบบทดสอบแล้ว');
        }

      })
  }

  stopTimeOut() {
    this.intervalTimeOut$.unsubscribe();
    this.timeOut = 0;
  }

  answer() {
    const q = this.questionList[this.currentPage];

    if (q.questionType === 'S' && this.selectedChoice.length === 1) {
      if (this.selectedChoice[0].choiceCorrect) {
        this.selectedChoice = [];
        this.point++;
      }
    } else if (q.questionType === 'M') {
      const choiceUserCorrect = this.selectedChoice.filter(item => item.choiceCorrect).length
      const choiceCorrectAll = [...q.choiceArr].filter(item => item.choiceCorrect).length

      if (this.selectedChoice.length > choiceCorrectAll) {
        this.point--;
      } else {
        this.point += (choiceUserCorrect / choiceCorrectAll);
      }

    }
  }

  showDisplay(detail: string) {

    this.detail = detail;
    this.display = true;

  }

  postAnswer() {
    const pass = (this.point / this.questionList.length) * 100;
    this.task['user'] = { userId: this.authService.user.userId };
    this.task['taskStatus'] = pass >= this.quizPass;
    this.task['taskScore'] = this.point;
    this.task['taskPass'] = pass.toString() + '%';
    this.task['taskFinish'] = new Date();

    this.onlineQuizService.postTask(this.task).subscribe({
      complete: () => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'ระบบได้บันทึกคำตอบเรียบร้อยแล้ว', life: 3000 });
        setTimeout(() => {
          this.router.navigate(['']);
        }, 3000)

      },
      error: () => {
        this.displayError = true;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'มีบางอย่างผิดพลาด', life: 3000 });
      }
    });

    this.display = false;
  }

  closeDisplayError() {
    this.displayError = false;
    this.router.navigate(['']);
  }

}
