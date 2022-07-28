import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { OnlineQuizAdminService } from 'src/app/service/online-quiz-admin.service';

@Component({
  selector: 'app-quiz-admin',
  templateUrl: './quiz-admin.component.html',
  styleUrls: ['./quiz-admin.component.scss']
})
export class QuizAdminComponent implements OnInit {

  searchText?: string;

  dialog: boolean = false;
  quizList: any[] = [];
  quiz?: any;
  selectedItem?: any;
  submitted: boolean = false;
  caregoryList: any[] = [];

  constructor(private onlineQuizAdminService: OnlineQuizAdminService, private router: Router, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {

    let _res: any[];
    this.onlineQuizAdminService.getQuiz().subscribe({
      next: (res) => {
        _res = [...res];
        _res.forEach(itemQuiz => {
          this.onlineQuizAdminService.getQuestion().subscribe(res => {
            itemQuiz['questionAll'] = [...res].filter(itemQuestion => itemQuestion.quiz.quizId === itemQuiz.quizId).length;
          })
        })
      },
      complete: () => {
        this.quizList = _res;
        this.onlineQuizAdminService.getCategory().subscribe(res => this.caregoryList = res);
      }
    })

    const name = this.router.url.split('=')[1];
    if (name) this.searchText = decodeURI(name);

  }

  search(dt: any) {
    dt.filterGlobal(this.searchText, 'contains')
  }

  refresh() {
    this.quiz = {};
    this.ngOnInit();
  }

  goPageByName(name: string) {
    this.router.navigate(['/online-quiz/admin/', 'question'], {
      queryParams: { name: name }
    })
  }

  openNew() {
    this.quiz = {
      category: this.caregoryList[this.caregoryList.findIndex(item => item.categoryName === this.searchText)],
      quizPass: 50
    };
    this.submitted = false;
    this.dialog = true;
  }

  hideDialog() {
    this.dialog = false;
    this.submitted = false;
  }

  editItem(quiz: any) {
    this.quiz = { ...quiz };
    this.quiz.quizStart = new Date(this.quiz.quizStart);
    this.quiz.quizEnd = new Date(this.quiz.quizEnd);
    this.dialog = true;
  }

  saveItem() {
    this.submitted = true;
    const name = this.quiz.quizName?.trim();
    const pass = this.quiz.quizPass?.toString().trim();
    const numberOfQuestion = this.quiz.numberOfQuestion?.toString().trim();
    const category = this.quiz.category;
    const start = this.quiz.quizStart;
    const end = this.quiz.quizEnd;
    if (name && pass && numberOfQuestion && category && start && end) {
      if (this.quiz.quizId) {
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

  deleteSelectedItem() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected quiz?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        [...this.selectedItem].forEach((item, index) => {
          this.onlineQuizAdminService.deleteQuiz(item).subscribe({
            complete: () => {
              if (index === this.selectedItem?.length - 1) {
                this.refresh();
                this.selectedItem = null;
              }
              this.onlineQuizAdminService.alertMsg('success', 'Successful', `Quiz ${item.quizName} deleted`);
            },
            error: () => {
              this.onlineQuizAdminService.alertMsg('error', 'Error', `Quiz ${item.quizName} delete error`);
            }
          })
        })
      }
    });
  }

  activeSwitch(quiz: any, index: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to switch ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.saveToDatabase(quiz);
      },
      reject: () => {
        this.quizList[index].quizActive = !this.quizList[index].quizActive
      }
    });
  }

}
