import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { QuizKeyService } from 'src/app/service/quiz-key.service';

@Component({
  selector: 'app-navbar-user',
  templateUrl: './navbar-user.component.html',
  styleUrls: ['./navbar-user.component.scss']
})
export class NavbarUserComponent implements OnInit {

  constructor(private quizKeyService: QuizKeyService, private router: Router, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
  }

  goHome() {
    if (this.quizKeyService.quizKey) {
      return this.confirmationService.confirm({
        message: 'คุณต้องการออกจากหน้านี้หรือไม่',
        header: 'ยืนยัน',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.router.navigate(['online-quiz']);
        }
      });
    }
    return this.router.navigate(['online-quiz']);

  }
}
