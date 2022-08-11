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
  dialogChoice: boolean = false;
  questionList: any[] = [];
  question?: any;
  choice?: any;
  selectedItem?: any;
  submitted: boolean = false;
  quizList: any[] = [];
  questionTypeList: any[] = [];
  choiceCorrectList: any[] = [];

  constructor(private onlineQuizAdminService: OnlineQuizAdminService, private router: Router, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {

    this.onlineQuizAdminService.getQuestion().subscribe(res => {
      let _res = [...res];

      _res.forEach(itemQuestion => {
        this.onlineQuizAdminService.getChoiceCorrect(itemQuestion.questionId).subscribe((resChoice: any) => {
          for (let choice of resChoice) {
            let question = itemQuestion.choiceArr.find((item: any) => item.choiceId == choice.choice.choiceId)
            question.choiceCorrectId = choice.choiceCorrectId;
            question.choiceCorrectCheck = choice.choiceCorrectCheck;
          }
        })

      })
      this.questionList = _res;
      console.log(_res);


      this.onlineQuizAdminService.getQuiz().subscribe(res => this.quizList = res);
      this.questionTypeList = ['S', 'M'];
      this.choiceCorrectList = ['true', 'false'];

    })

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
    const _question = { ...question };
    _question.questionName = `<p>${_question.questionName}</p>`;
    this.question = _question;
    this.dialog = true;
  }

  editItemChoice(choice: any) {
    const _choice = { ...choice };
    _choice.choiceName = `<p>${_choice.choiceName}</p>`;
    _choice.choiceCorrectCheck = _choice.choiceCorrectCheck.toString();
    this.choice = _choice;
    this.dialogChoice = true;
  }

  saveItem() {
    this.submitted = true;
    this.question.questionName = this.question.questionName.slice(3, -4);
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
    this.choice.choiceName = this.choice.choiceName.slice(3, -4);
    const name = this.choice.choiceName?.trim();
    const correcte = this.choice.choiceCorrectCheck;


    if (name && correcte) {
      if (this.choice.choiceId) {
        this.saveChoiceToDatabase(this.choice);
      }
      else {
        let cId: number;
        this.onlineQuizAdminService.newChoice(this.choice).subscribe({
          next: (res: any) => {
            cId = res.choiceId;
          },
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
