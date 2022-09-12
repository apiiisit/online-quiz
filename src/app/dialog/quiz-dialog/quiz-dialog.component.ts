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

  @Input() category: any = {};
  @Input() quiz: any = {};
  @Input() questionList: any[] = [];

  caregoryList: any[] = [];
  randomPassword: boolean = false;

  constructor(private onlineQuizAdminService: OnlineQuizAdminService, private router: Router) { }

  ngOnInit(): void {
    this.onlineQuizAdminService.getCategory().subscribe(res => this.caregoryList = res)
  }

  refresh() {
    this.dialog = false;
    setTimeout(() => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['online-quiz/management', 'quiz'])
      });
    }, 2000);
  }

  hideDialog() {
    this.dialog = false;
  }

  addQuestion() {
    this.questionList.push({ choiceArr: [{ choiceCorrect: { choiceCorrectCheck: false } }, { choiceCorrect: { choiceCorrectCheck: false } }, { choiceCorrect: { choiceCorrectCheck: false } }, { choiceCorrect: { choiceCorrectCheck: false } }] })
  }

  addChoice(index: number) {
    this.questionList[index].choiceArr.push({ choiceCorrect: { choiceCorrectCheck: false } })
  }

  removeChoice(index: number, choiceIndex: number) {
    this.questionList[index].choiceArr.splice(choiceIndex, 1);

    if (this.questionList[index].choiceSelected) {
      if (this.questionList[index].choiceSelected > choiceIndex) {
        this.questionList[index].choiceSelected--;
      }
    }

  }

  saveItem() {
    if (typeof this.category.categoryName == 'object') {
      this.category = this.category.categoryName
    }

    if (this.quiz.quizId) {
      this.editQuiz()
    } else {
      this.newQuiz()
    }
  }

  editQuiz() {
    this.onlineQuizAdminService.newCategory(this.category).subscribe((res: any) => {
      this.quiz.category = { categoryId: res.categoryId }
      if (this.randomPassword) this.quiz.quizPassword = null;
      this.onlineQuizAdminService.updateQuiz(this.quiz).subscribe({
        next: (res: any) => {
          let quizId = res.quizId
          for (let question of this.questionList) {
            question.quiz = { quizId: quizId };
            question.questionType = question.questionType == true ? 'M' : 'S'

            if (question.questionType == 'S') {
              question.choiceArr.forEach((item: any) => {
                item.choiceCorrect.choiceCorrectId = 0
                item.choiceCorrect.choiceCorrectCheck = false
              })
              question.choiceArr[question.choiceSelected].choiceCorrect.choiceCorrectId = 1
              question.choiceArr[question.choiceSelected].choiceCorrect.choiceCorrectCheck = true
            } else {
              question.choiceArr.forEach((item: any) => {
                item.choiceCorrect.choiceCorrectId = +item.choiceCorrect.choiceCorrectCheck
              })
            }
            if (question.questionId) {
              this.onlineQuizAdminService.updateQuestion(question).subscribe()
            } else {
              this.onlineQuizAdminService.newQuestion(question).subscribe()
            }
          }
        },
        complete: () => {
          this.refresh();
          this.onlineQuizAdminService.alertMsg('success', 'Successful', 'Quiz updated');
        },
        error: () => {
          this.onlineQuizAdminService.alertMsg('error', 'Error', 'Quiz update error');
        }
      })
    })
  }

  newQuiz() {
    this.onlineQuizAdminService.newCategory(this.category).subscribe((res: any) => {
      this.quiz.category = { categoryId: res.categoryId }
      if (this.randomPassword) this.quiz.quizPassword = null;
      this.onlineQuizAdminService.newQuiz(this.quiz).subscribe({
        next: (res: any) => {
          let quizId = res.quizId
          for (let question of this.questionList) {
            question.quiz = { quizId: quizId };
            question.questionType = question.questionType == true ? 'M' : 'S'

            if (question.questionType == 'S') {
              question.choiceArr.forEach((item: any) => {
                item.choiceCorrect.choiceCorrectId = 0
                item.choiceCorrect.choiceCorrectCheck = false
              })
              question.choiceArr[question.choiceSelected].choiceCorrect.choiceCorrectId = 1
              question.choiceArr[question.choiceSelected].choiceCorrect.choiceCorrectCheck = true
            } else {
              question.choiceArr.forEach((item: any) => {
                item.choiceCorrect.choiceCorrectId = +item.choiceCorrect.choiceCorrectCheck
              })
            }

            this.onlineQuizAdminService.newQuestion(question).subscribe()
          }
        },
        complete: () => {
          this.refresh();
          this.onlineQuizAdminService.alertMsg('success', 'Successful', 'Quiz created');
        },
        error: () => {
          this.onlineQuizAdminService.alertMsg('error', 'Error', 'Quiz create error');
        }
      })
    })
  }

  generateQuestion(num: number) {
    for (let i = this.questionList.length; i < num; i++) {
      this.questionList.push({ choiceArr: [{ choiceCorrect: { choiceCorrectCheck: false } }, { choiceCorrect: { choiceCorrectCheck: false } }, { choiceCorrect: { choiceCorrectCheck: false } }, { choiceCorrect: { choiceCorrectCheck: false } }] })
    }
  }


}
