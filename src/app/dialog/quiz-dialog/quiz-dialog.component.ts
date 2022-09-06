import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { OnlineQuizAdminService } from 'src/app/service/online-quiz-admin.service';

@Component({
  selector: 'app-quiz-dialog',
  templateUrl: './quiz-dialog.component.html',
  styleUrls: ['./quiz-dialog.component.scss']
})
export class QuizDialogComponent implements OnInit {

  @Input() dialog: boolean = false;
  @Input() quiz: any = {};
  caregoryList: any[] = [];
  questionList: any[] = [];
  status: any;

  canRandomPassword: boolean = false;
  submitted: boolean = false;

  constructor(private onlineQuizAdminService: OnlineQuizAdminService, private router: Router, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.onlineQuizAdminService.getCategory().subscribe(res => this.caregoryList = res)
    this.status = [{ id: 0, sub: 'false', value: 'Hidden' }, { id: 1, sub: 'true', value: 'Active' }]
    
    this.questionList = new Array(2);

  }

  refresh() {
    this.quiz = {};
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }


  hideDialog() {
    this.dialog = false;
    this.canRandomPassword = false;
    this.submitted = false;
  }

  addQuestion() {
    this.questionList.push([])
  }

  saveItem() {
    this.submitted = true;
    const name = this.quiz.quizName?.trim();
    const pass = this.quiz.quizPass?.toString().trim();
    const numberOfQuestion = this.quiz.numberOfQuestion?.toString().trim();
    const category = this.quiz.category;
    const start = this.quiz.quizStart;
    const averageTestTime = this.quiz.averageTestTime?.toString().trim();

    if (name && pass && numberOfQuestion && category && start && averageTestTime) {

      if (this.quiz.quizId) {
        if (!this.canRandomPassword && this.quiz.quizPassword.toString().trim().length <= 0) return
        if (this.canRandomPassword) this.quiz.quizPassword = null;
        this.saveToDatabase(this.quiz);
      }
      else {
        this.onlineQuizAdminService.newQuiz(this.quiz).subscribe({
          complete: () => {
            this.refresh();
            this.onlineQuizAdminService.alertMsg('success', 'Successful', 'Quiz created');
          },
          error: () => {
            this.onlineQuizAdminService.alertMsg('error', 'Error', 'Quiz create error');
          }
        });
      }
      this.dialog = false;
    }
  }

  saveToDatabase(quiz: any) {
    this.onlineQuizAdminService.updateQuiz(quiz).subscribe({
      complete: () => {
        this.refresh();
        this.onlineQuizAdminService.alertMsg('success', 'Successful', 'Quiz updated');
      },
      error: () => {
        this.onlineQuizAdminService.alertMsg('error', 'Error', 'Quiz update error');
      }
    });
  }
}
