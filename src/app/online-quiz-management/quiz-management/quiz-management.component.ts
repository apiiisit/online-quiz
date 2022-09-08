import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { OnlineQuizAdminService } from 'src/app/service/online-quiz-admin.service';

@Component({
  selector: 'app-quiz-management',
  templateUrl: './quiz-management.component.html',
  styleUrls: ['./quiz-management.component.scss']
})
export class QuizManagementComponent implements OnInit {

  dialog: boolean = false;
  quizList: any[] = [];

  category: any = {};
  quiz: any = {};
  questionList: any[] = [];

  constructor(private onlineQuizAdminService: OnlineQuizAdminService, private router: Router, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {

    this.onlineQuizAdminService.getQuiz().subscribe(res => {
      res.forEach((item: any) => {
        item['quizStart'] = item['quizStart'].slice(0, -5);
      })
      this.quizList = res;
    })
  }

  editItem(_quiz: any) {

    const quiz = { ..._quiz };
    quiz.quizStart = new Date(quiz.quizStart)
    this.onlineQuizAdminService.getQuestionByQuiz(quiz.quizId).subscribe(res => {
      for (let question of res) {
        if (question.questionType == 'S') {
          question.choiceSelected = question.choiceArr.findIndex((x: any) => x.choiceCorrect.choiceCorrectCheck)
        }
        question.questionType = question.questionType == 'M'
      }
      this.questionList = res
    })
    this.category = quiz.category;
    this.quiz = quiz;

    this.dialog = false;
    setTimeout(() => this.dialog = true);
  }

}
