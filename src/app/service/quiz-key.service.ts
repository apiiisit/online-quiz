import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizKeyService {

  private _isQuizKey$ = new BehaviorSubject<boolean>(false);
  isQuizKey$ = this._isQuizKey$.asObservable();

  constructor(private http: HttpClient) { }

  postQuizKey() {
    this._isQuizKey$.next(true);
  }
}
