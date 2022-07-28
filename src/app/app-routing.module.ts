import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { LoginComponent } from './authentication/login/login.component';
import { HasRoleGuard } from './guard/has-role.guard';
import { IsAuthenticatedGuard } from './guard/is-authenticated.guard';
import { CategoryAdminComponent } from './online-quiz-admin/category-admin/category-admin.component';
import { OnlineQuizAdminComponent } from './online-quiz-admin/online-quiz-admin.component';
import { QuestionAdminComponent } from './online-quiz-admin/question-admin/question-admin.component';
import { QuizAdminComponent } from './online-quiz-admin/quiz-admin/quiz-admin.component';
import { UserAdminComponent } from './online-quiz-admin/user-admin/user-admin.component';
import { CategoryComponent } from './online-quiz/category/category.component';
import { OnlineQuizComponent } from './online-quiz/online-quiz.component';
import { QuestionComponent } from './online-quiz/question/question.component';
import { QuizComponent } from './online-quiz/quiz/quiz.component';

const routes: Routes = [
  { path: '', redirectTo: 'online-quiz/auth', pathMatch: 'full' },
  {
    path: 'online-quiz/auth',
    component: AuthenticationComponent,
    children: [
      {
        path: '',
        component: LoginComponent
      }
    ]
  },
  {
    path: 'online-quiz',
    component: OnlineQuizComponent,
    canActivate: [IsAuthenticatedGuard],
    children: [
      {
        path: '',
        component: CategoryComponent
      },
      {
        path: 'quiz/:categoryId',
        component: QuizComponent
      },
      {
        path: 'quiz/:categoryId/:quizId',
        component: QuestionComponent
      },
    ]
  },
  {
    path: 'online-quiz/admin',
    component: OnlineQuizAdminComponent,
    canActivate: [IsAuthenticatedGuard, HasRoleGuard],
    data: {
      role: 'Admin'
    },
    children: [
      {
        path: '',
        component: CategoryAdminComponent
      },
      {
        path: 'quiz',
        component: QuizAdminComponent
      },
      {
        path: 'question',
        component: QuestionAdminComponent
      },
      {
        path: 'user',
        component: UserAdminComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
