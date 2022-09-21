import { Component, OnInit } from '@angular/core';
import { QuizKeyService } from '../service/quiz-key.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

  constructor(private quizKeyService: QuizKeyService) { }

  ngOnInit(): void {
    this.quizKeyService.clearQuizKey();
  }

}
