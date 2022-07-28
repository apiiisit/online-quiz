import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { OnlineQuizAdminService } from 'src/app/service/online-quiz-admin.service';

@Component({
  selector: 'app-question-admin',
  templateUrl: './question-admin.component.html',
  styleUrls: ['./question-admin.component.scss']
})
export class QuestionAdminComponent implements OnInit {

  searchText?: string;

  dialog: boolean = false;
  dialogChoice: boolean = false;
  questionList: any[] = [];
  question?: any;
  choice?: any;
  selectedItem?: any;
  submitted: boolean = false;
  quizList: any[] = [];
  questionTypeList: any[] = [];
  choiceCorrectList: any[] = [];

  constructor(private onlineQuizAdminService: OnlineQuizAdminService, private router: Router, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {

    let _res: any[];
    this.onlineQuizAdminService.getQuestion().subscribe({
      next: (res) => {
        _res = [...res];
        _res.forEach(itemQuestion => {
          const correctLen = [...itemQuestion.choiceArr].filter(i => i.choiceCorrect === true).length
          itemQuestion['verified'] = itemQuestion.questionType === 'S' ? correctLen === 1 : correctLen >= 2;
        })
      },
      complete: () => {
        this.questionList = _res;
        this.onlineQuizAdminService.getQuiz().subscribe(res => this.quizList = res);
        this.questionTypeList = ['S', 'M'];
        this.choiceCorrectList = ['true', 'false'];
      }
    });

    const name = this.router.url.split('=')[1];
    if (name) this.searchText = decodeURI(name);

  }

  search(dt: any) {
    dt.filterGlobal(this.searchText, 'contains')
  }

  refresh() {
    this.question = {};
    this.choice = {};
    this.ngOnInit();
  }

  openNew() {
    this.question = {
      questionType: 'S',
      questionTime: 30,
      quiz: this.quizList[this.quizList.findIndex(item => item.quizName === this.searchText)]
    };
    this.submitted = false;
    this.dialog = true;
  }

  openDialogChoice(question: any) {
    this.choice = {
      choiceCorrect: 'false',
      question: {
        questionId: question.questionId
      }
    };
    this.dialogChoice = true;
  }

  hideDialog() {
    this.dialog = false;
    this.dialogChoice = false;
    this.submitted = false;
  }

  editItem(question: any) {
    this.question = { ...question };
    this.dialog = true;
  }

  editItemChoice(choice: any) {
    this.choice = { ...choice };
    this.choice.choiceCorrect = this.choice.choiceCorrect.toString();
    this.dialogChoice = true;
  }

  saveItem() {
    this.submitted = true;
    const name = this.question.questionName?.trim();
    const type = this.question.questionType;
    const quiz = this.question.quiz;
    const delay = this.question.questionTime?.toString().trim();
    if (name && type && quiz && delay) {
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

  saveItemChoice() {
    this.submitted = true;
    const name = this.choice.choiceName?.trim();
    const correcte = this.choice.choiceCorrect;

    if (name && correcte) {
      if (this.choice.choiceId) {
        this.saveChoiceToDatabase(this.choice);
      }
      else {
        this.onlineQuizAdminService.newChoice(this.choice).subscribe({
          complete: () => {
            this.refresh();
            this.onlineQuizAdminService.alertMsg('success', 'Successful', 'Choice created');
          },
          error: () => {
            this.onlineQuizAdminService.alertMsg('error', 'Error', 'Choice create error');
          }
        });
      }
      this.dialogChoice = false;
    }
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

  saveChoiceToDatabase(choice: any) {
    this.onlineQuizAdminService.updateChoice(choice).subscribe({
      complete: () => {
        this.refresh();
        this.onlineQuizAdminService.alertMsg('success', 'Successful', 'Choice updated');
      },
      error: () => {
        this.onlineQuizAdminService.alertMsg('error', 'Error', 'Choice update error');
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

  deleteItemChoice(choice: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + choice.choiceName + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onlineQuizAdminService.deleteChoice(choice).subscribe({
          complete: () => {
            this.refresh();
            this.onlineQuizAdminService.alertMsg('success', 'Successful', 'Choice deleted');
          },
          error: () => {
            this.onlineQuizAdminService.alertMsg('error', 'Error', 'Choice delete error');
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
