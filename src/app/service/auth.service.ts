import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { OnlineQuizService } from './online-quiz.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private readonly TOKEN_NAME = 'online-quiz';
  isLoggedIn$ = this._isLoggedIn$.asObservable();
  user!: any;
  
  get token() {
    return localStorage.getItem(this.TOKEN_NAME);
  }

  constructor(private onlineQuizService: OnlineQuizService) {
    this._isLoggedIn$.next(!!this.token);
    this.user = this.getUser(this.token!)
  }

  login(username: string, password: string) {
    return this.onlineQuizService.login(username, password).pipe(
      tap(res => {
        this._isLoggedIn$.next(true);
        localStorage.setItem(this.TOKEN_NAME, res.token);
        this.user = this.getUser(res.token)
      })
    );
  }

  logout() {
    this._isLoggedIn$.next(false);
    localStorage.clear();
  }

  updateLastLogin() {
    return this.onlineQuizService.updateLastLogin(this.user.userid);
  }

  private getUser(token: string) {
    if (!token) return;
    const user = atob(token.split('.')[1]).split(',');
    return {
      userid: user[0],
      username: user[1],
      role: user[2] === 'A' ? 'Admin' : 'User'
    }
  }
}
