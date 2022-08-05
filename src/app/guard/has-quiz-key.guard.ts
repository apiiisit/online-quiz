import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { QuizKeyService } from '../service/quiz-key.service';

@Injectable({
  providedIn: 'root'
})
export class HasQuizKeyGuard implements CanActivate {

  constructor(private quizKeyService: QuizKeyService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.quizKeyService.isQuizKey$.pipe(
      tap(isQuizKey => {
        if(!isQuizKey) {
          this.router.navigate(['/online-quiz/']);
        }
      })
    )
  }
  
}
