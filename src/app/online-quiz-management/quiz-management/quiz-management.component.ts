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

  constructor(private confirmationService: ConfirmationService, private onlineQuizAdminService: OnlineQuizAdminService, private router: Router) { }

  ngOnInit(): void {

    this.onlineQuizAdminService.getCategory().subscribe(res => this.categoryList = res);
    this.onlineQuizAdminService.getQuiz().subscribe(res => {
      this.quizListDropdown = res;
      this.quizList = this.mapTask(res);
    });

  }

  refresh() {
    this.ngOnInit();
  }

  editItem(_quiz: any) {
    this.category = { ..._quiz.category };
    delete this.category.quizLength

    let quiz = { ..._quiz };
    quiz.quizStart = new Date(quiz.quizStart)

    this.quiz = quiz;

    this.onlineQuizAdminService.getQuestionByQuiz(quiz.quizId).subscribe(res => {
      for (let question of res) {

        if (question.questionType == 'S') {
          question.choiceSelected = question.choiceArr.findIndex((x: any) => x.choiceCorrect.choiceCorrectCheck)
        }
        question.questionType = question.questionType == 'M'

        this.choiceCorrect(question)
      }
      this.questionList = res
    })

    this.dialog = false;
    setTimeout(() => this.dialog = true);
  }

  choiceCorrect(question: any) {
    if (question.questionType == true) {
      question.validateChoice = question.choiceArr.filter((x: any) => x.choiceCorrect.choiceCorrectCheck == true).length >= 2
    } else if (!question.questionType || question.questionType == false) {
      question.validateChoice = Object.keys(question).includes('choiceSelected')
    }
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

  sendQuizToResult(quiz: any) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['online-quiz/management/results'], { queryParams: { quiz: quiz.quizId } });
    });

  }

  deleteItem(quiz: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + quiz.quizName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onlineQuizAdminService.deleteQuiz(quiz).subscribe({
          complete: () => {
            this.refresh();
            this.onlineQuizAdminService.alertMsg('success', 'Successful', 'Quiz deleted');
          },
          error: () => {
            this.onlineQuizAdminService.alertMsg('error', 'Error', 'Quiz delete error');
          }
        });
      }
    });
  }

}
