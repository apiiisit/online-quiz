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
  categoryList: any[] = [];
  quizListDropdown: any[] = [];
  quizList: any[] = [];
  questionList: any[] = [];

  category: any = {};
  quiz: any = {};

  expandedRows: any = {};

  categorySelected: any;
  quizSelected: any;
  statusSelected: any;

  constructor(private onlineQuizAdminService: OnlineQuizAdminService) { }

  ngOnInit(): void {

    this.onlineQuizAdminService.getCategory().subscribe(res => this.categoryList = res);
    this.onlineQuizAdminService.getQuiz().subscribe(res => {
      this.quizListDropdown = res;
      this.quizList = this.mapTask(res);
    });

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

  mapTask(res: any) {
    res.forEach((item: any) => {
      this.expandedRows[item.category.categoryId] = true
      item['quizStart'] = item['quizStart'].slice(0, -5);
    })
    return res;
  }

  filter() {
    const categoryId = this.categorySelected?.categoryId
    const quizId = this.quizSelected?.quizId
    let status;

    if (this.statusSelected && this.statusSelected.length == 1) {
      status = (this.statusSelected[0] == 'Active').toString()
    } else {
      status = null;
    }

    const query = [];
    if (categoryId) query.push(`categoryId=${categoryId}`)
    if (quizId) query.push(`quizId=${quizId}`)
    if (status) query.push(`status=${status}`)

    this.onlineQuizAdminService.getQuizFilter(query.join('&')).subscribe(res => this.quizList = this.mapTask(res));
  }

}
