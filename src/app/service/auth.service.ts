import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { OnlineQuizService } from './online-quiz.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private readonly TOKEN_NAME = 'online-quiz';
  private readonly PROFILE = 'profile';
  isLoggedIn$ = this._isLoggedIn$.asObservable();
  user!: any;
  profileUrl!: any;

  get token() {
    return localStorage.getItem(this.TOKEN_NAME);
  }

  get profile() {
    return localStorage.getItem(this.PROFILE);
  }

  constructor(private onlineQuizService: OnlineQuizService) {
    this._isLoggedIn$.next(!!this.token);
    this.user = this.getUser(this.token!);
    this.profileUrl = this.getProfile(this.profile!);

  }

  login(username: string, password: string) {
    return this.onlineQuizService.login(username, password).pipe(
      tap(res => {
        this._isLoggedIn$.next(true);
        localStorage.setItem(this.TOKEN_NAME, res.token);
        this.user = this.getUser(res.token)
        
        const profileBase64 = btoa(res.profile || 'person.png');
        localStorage.setItem(this.PROFILE, profileBase64);
        this.profileUrl = this.getProfile(profileBase64);
      })
    );
  }

  logout() {
    this._isLoggedIn$.next(false);
    localStorage.clear();
  }

  updateLastLogin() {
    return this.onlineQuizService.updateLastLogin(this.user.userId);
  }

  private getUser(token: string) {
    if (!token) return;
    const user = atob(token.split('.')[1]).split(',');
    return {
      userId: user[0],
      userName: user[1],
      role: user[2] === 'A' ? 'Admin' : 'User'
    }
  }

  private getProfile(profile: string) {
    if (!profile) return;
    const profileStr = atob(profile);
    return profileStr === 'person.png' ? 'assets/images/person.png' : `api/user/image/${profileStr}`;
  }
  
}
