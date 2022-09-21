import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizKeyService {

  private _isQuizKey$ = new BehaviorSubject<boolean>(false);
  isQuizKey$ = this._isQuizKey$.asObservable();

  get quizKey() {
    return localStorage.getItem('quiz-key')
  }

  constructor() {
    this._isQuizKey$.next(!!this.quizKey);
  }

  postQuizKey() {
    this._isQuizKey$.next(true);
    localStorage.setItem('quiz-key', '!@#$%^&*()_+')
  }

  clearQuizKey() {
    this._isQuizKey$.next(false); 
    localStorage.removeItem('quiz-key')
  }
}
