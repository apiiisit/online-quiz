import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { OnlineQuizAdminService } from 'src/app/service/online-quiz-admin.service';

@Component({
  selector: 'app-question-admin',
  templateUrl: './question-admin.component.html',
  styleUrls: ['./question-admin.component.scss']
})
export class QuestionAdminComponent implements OnInit {

  searchText?: string;

  dialog: boolean = false;
  questionList: any[] = [];
  question?: any;
  selectedItem?: any;
  submitted: boolean = false;
  quizList: any[] = [];
  questionTypeList: any[] = [];
  choiceCorrectList: any[] = [];

  constructor(private onlineQuizAdminService: OnlineQuizAdminService, private router: Router, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {

    this.onlineQuizAdminService.getQuestion().subscribe(res => this.questionList = res);

    this.onlineQuizAdminService.getchoiceCorrect().subscribe(res => {
      for (let correct of res) correct.choiceCorrectCheck = correct.choiceCorrectCheck.toString();
      this.choiceCorrectList = res;
    })

    this.onlineQuizAdminService.getQuiz().subscribe(res => this.quizList = res);
    this.questionTypeList = ['S', 'M'];

    const name = this.router.url.split('=')[1];
    if (name) this.searchText = decodeURI(name);

  }

  search(dt: any) {
    dt.filterGlobal(this.searchText, 'contains')
  }

  refresh() {
    this.question = {};
    this.ngOnInit();
  }

  openNew() {
    this.question = {
      questionType: 'S',
      questionTime: 30,
      quiz: this.quizList[this.quizList.findIndex(item => item.quizName === this.searchText)],
      choiceArr: []
    };

    for (let i = 0; i < 4; i++) {
      this.question.choiceArr.push({ choiceCorrect: this.choiceCorrectList[0] })
    }
    this.submitted = false;
    this.dialog = true;
  }

  hideDialog() {
    this.refresh();
    this.dialog = false;
    this.submitted = false;
  }

  editItem(question: any) {
    const _question = { ...question };
    for (let choice of _question.choiceArr) {
      choice.choiceCorrect.choiceCorrectCheck = choice.choiceCorrect.choiceCorrectCheck.toString();
      choice.choiceName = `<p>${choice.choiceName}</p>`;
    }

    _question.questionName = `<p>${_question.questionName}</p>`;
    this.question = _question;
    this.dialog = true;
  }

  saveItem() {
    this.submitted = true;

    const name = this.question.questionName?.trim();
    const type = this.question.questionType;
    const quiz = this.question.quiz;
    const delay = this.question.questionTime?.toString().trim();

    for (let choice of this.question.choiceArr) {
      if (!choice.choiceName) return;
    }

    if (name && name.length > 7 && type && quiz && delay) {

      this.question.questionName = this.validateData(this.question.questionName);

      for (let choice of this.question.choiceArr) {
        choice.choiceName = this.validateData(choice.choiceName);
      }

      if (this.question.questionId) {
        this.saveToDatabase(this.question);
      }
      else {
        this.onlineQuizAdminService.newQuestion(this.question).subscribe({
          complete: () => {
            this.refresh();
            this.onlineQuizAdminService.alertMsg('success', 'Successful', 'Question created');
          },
          error: () => {
            this.onlineQuizAdminService.alertMsg('error', 'Error', 'Question create error');
          }
        });
      }
      this.dialog = false;
    }
  }

  validateData(val: string) {
    if (val.slice(0, 3) == '<p>') val = val.slice(3);
    if (val.slice(-4) == '</p>') val = val.slice(0, -4);
    return val;
  }

  saveToDatabase(question: any) {
    this.onlineQuizAdminService.updateQuestion(question).subscribe({
      complete: () => {
        this.refresh();
        this.onlineQuizAdminService.alertMsg('success', 'Successful', 'Question updated');
      },
      error: () => {
        this.onlineQuizAdminService.alertMsg('error', 'Error', 'Question update error');
      }
    });
  }

  deleteItem(question: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + question.questionName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onlineQuizAdminService.deleteQuestion(question).subscribe({
          complete: () => {
            this.refresh();
            this.onlineQuizAdminService.alertMsg('success', 'Successful', 'Question deleted');
          },
          error: () => {
            this.onlineQuizAdminService.alertMsg('error', 'Error', 'Question delete error');
          }
        });
      }
    });
  }


  deleteSelectedItem() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Question?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        [...this.selectedItem].forEach((item, index) => {
          this.onlineQuizAdminService.deleteQuestion(item).subscribe({
            complete: () => {
              if (index === this.selectedItem?.length - 1) {
                this.refresh();
                this.selectedItem = null;
              }
              this.onlineQuizAdminService.alertMsg('success', 'Successful', `Question ${item.questionName} deleted`);
            },
            error: () => {
              this.onlineQuizAdminService.alertMsg('error', 'Error', `Question ${item.questionName} delete error`);
            }
          })
        })
      }
    });
  }

}
