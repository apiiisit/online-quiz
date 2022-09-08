import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { ChangePasswordComponent } from './authentication/change-password/change-password.component';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { HasQuizKeyGuard } from './guard/has-quiz-key.guard';
import { HasRoleGuard } from './guard/has-role.guard';
import { IsAuthenticatedGuard } from './guard/is-authenticated.guard';
import { CategoryAdminComponent } from './online-quiz-admin/category-admin/category-admin.component';
import { DashboardComponent } from './online-quiz-admin/dashboard/dashboard.component';
import { OnlineQuizAdminComponent } from './online-quiz-admin/online-quiz-admin.component';
import { QuestionAdminComponent } from './online-quiz-admin/question-admin/question-admin.component';
import { QuizAdminComponent } from './online-quiz-admin/quiz-admin/quiz-admin.component';
import { ScoreDetailAdminComponent } from './online-quiz-admin/score-detail-admin/score-detail-admin.component';
import { UserAdminComponent } from './online-quiz-admin/user-admin/user-admin.component';
import { CategoryManagementComponent } from './online-quiz-management/category-management/category-management.component';
import { DashboardManagementComponent } from './online-quiz-management/dashboard-management/dashboard-management.component';
import { OnlineQuizManagementComponent } from './online-quiz-management/online-quiz-management.component';
import { QuizManagementComponent } from './online-quiz-management/quiz-management/quiz-management.component';
import { ResultManagementComponent } from './online-quiz-management/result-management/result-management.component';
import { SettingManagementComponent } from './online-quiz-management/setting-management/setting-management.component';
import { UserManagementComponent } from './online-quiz-management/user-management/user-management.component';
import { CategoryComponent } from './online-quiz/category/category.component';
import { OnlineQuizComponent } from './online-quiz/online-quiz.component';
import { QuestionComponent } from './online-quiz/question/question.component';
import { QuizComponent } from './online-quiz/quiz/quiz.component';
import { Mode } from './type/mode';

const routes: Routes = [
  { path: '', redirectTo: 'online-quiz/auth', pathMatch: 'full' },
  {
    path: 'online-quiz/auth',
    component: AuthenticationComponent,
    children: [
      {
        path: '',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent,
        data: { mode: Mode.ADD }
      },
      {
        path: 'resetpassword',
        component: ResetPasswordComponent,
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
        component: QuestionComponent,
        canActivate: [HasQuizKeyGuard]
      },
      {
        path: 'edit/profile',
        component: RegisterComponent,
        data: { mode: Mode.EDIT }
      },
      {
        path: 'edit/password',
        component: ChangePasswordComponent
      }
    ]
  },
  {
    path: 'online-quiz/management',
    component: OnlineQuizManagementComponent,
    canActivate: [IsAuthenticatedGuard, HasRoleGuard],
    data: {
      role: 'Admin'
    },
    children: [
      {
        path: '',
        component: DashboardManagementComponent
      },
      {
        path: 'category',
        component: CategoryManagementComponent
      },
      {
        path: 'quiz',
        component: QuizManagementComponent
      },
      {
        path: 'results',
        component: ResultManagementComponent
      },
      {
        path: 'users',
        component: UserManagementComponent
      },
      {
        path: 'settings',
        component: SettingManagementComponent
      }
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
        component: DashboardComponent
      },
      {
        path: 'category',
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
        path: 'score',
        component: ScoreDetailAdminComponent
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
