import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OnlineQuizAdminService } from 'src/app/service/online-quiz-admin.service';

@Component({
  selector: 'app-quiz-dialog',
  templateUrl: './quiz-dialog.component.html',
  styleUrls: ['./quiz-dialog.component.scss']
})
export class QuizDialogComponent implements OnInit {

  @Input() dialog: boolean = false;
  @Input() edit: boolean = false;

  @Input() category: any = {};
  @Input() quiz: any = {};
  @Input() questionList: any[] = [];

  submitted: boolean = false;
  editCategory: boolean = false;

  caregoryList: any[] = [];
  randomPassword: boolean = false;
  tempPassword?: string

  displayError: boolean = false;

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
    if (this.questionList[index].choiceSelected == choiceIndex) {
      delete this.questionList[index].choiceSelected;
    }

    this.questionList[index].choiceArr.splice(choiceIndex, 1);

    if (this.questionList[index].choiceSelected) {
      if (this.questionList[index].choiceSelected > choiceIndex) {
        this.questionList[index].choiceSelected--;
      }
    }
  }

  saveItem() {
    this.submitted = true;

    let category = { ...this.category };
    if (typeof this.category.categoryName == 'object') {
      category = this.category.categoryName
    }

    const categoryName = category.categoryName?.trim();
    const start = this.quiz.quizStart;
    const averageTestTime = this.quiz.averageTestTime;
    const quizName = this.quiz.quizName?.trim();
    const numberOfQuestion = this.quiz.numberOfQuestion;
    const quizPass = this.quiz.quizPass;
    const quizPassword = this.quiz.quizPassword?.trim();


    if (this.checkQuestion() && categoryName && categoryName.length > 5 && start && averageTestTime && quizName && quizName.length > 5 && numberOfQuestion && quizPass && ((this.randomPassword) || (!this.randomPassword && quizPassword && quizPassword.length > 5))) {

      if (this.questionList.length >= numberOfQuestion) {
        if (typeof this.category.categoryName == 'object') {
          this.category = this.category.categoryName
        }

        if (this.quiz.quizId) {
          this.editQuiz()
        } else {
          this.newQuiz()
        }
      } else {
        this.displayError = true;
      }


    }

  }

  checkQuestion() {
    let check = true;

    if (this.questionList.length <= 0) check = false

    if (check) {
      for (let question of this.questionList) {

        if (question.questionType == true) {
          check = question.choiceArr.filter((x: any) => x.choiceCorrect.choiceCorrectCheck == true).length >= 2
        } else if (!question.questionType || question.questionType == false) {
          check = Object.keys(question).includes('choiceSelected')
        }
        if (!check) return check

        if (check) {
          for (let key of ['questionName', 'questionTime', 'choiceArr']) {
            if (!Object.keys(question).includes(key)) {
              check = false;
              return check
            }
          }
        }

        if (check) {
          if (question.questionName?.trim().length < 5) {
            check = false
            return check
          }
        }

        if (check) {
          for (let choice of question.choiceArr) {
            if (!choice.choiceName || choice.choiceName == '') {
              check = false;
              return check
            }
          }
        }
      }
    }

    return check;
  }

  choiceCorrect(question: any) {
    if (question.questionType == true) {
      question.validateChoice = question.choiceArr.filter((x: any) => x.choiceCorrect.choiceCorrectCheck == true).length >= 2
    } else if (!question.questionType || question.questionType == false) {
      question.validateChoice = Object.keys(question).includes('choiceSelected')
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

  checkEditCategory() {
    this.editCategory = typeof this.category.categoryName != 'object'
  }

  randomPasswordToggle() {
    if (this.randomPassword) {
      this.tempPassword = this.quiz.quizPassword
      this.quiz.quizPassword = null
    } else {
      this.quiz.quizPassword = this.tempPassword
    }
  }

}
