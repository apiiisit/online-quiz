import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import localeTh from '@angular/common/locales/th';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeTh, 'th');

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { DialogModule } from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenubarModule } from 'primeng/menubar';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { ImageModule } from 'primeng/image';
import { EditorModule } from 'primeng/editor';

import { AutoFocusDirective } from './directive/auto-focus.directive';
import { ChoicePipe } from './pipe/choice.pipe';
import { RandomOrderPipe } from './pipe/random-order.pipe';
import { UserRolePipe } from './pipe/user-role.pipe';
import { AuthenticationComponent } from './authentication/authentication.component';
import { LoginComponent } from './authentication/login/login.component';
import { OnlineQuizComponent } from './online-quiz/online-quiz.component';
import { OnlineQuizAdminComponent } from './online-quiz-admin/online-quiz-admin.component';
import { NavbarUserComponent } from './online-quiz/navbar-user/navbar-user.component';
import { MenuUserComponent } from './online-quiz/menu-user/menu-user.component';
import { CategoryComponent } from './online-quiz/category/category.component';
import { QuestionComponent } from './online-quiz/question/question.component';
import { QuizComponent } from './online-quiz/quiz/quiz.component';
import { NavbarAdminComponent } from './online-quiz-admin/navbar-admin/navbar-admin.component';
import { CategoryAdminComponent } from './online-quiz-admin/category-admin/category-admin.component';
import { QuestionAdminComponent } from './online-quiz-admin/question-admin/question-admin.component';
import { QuizAdminComponent } from './online-quiz-admin/quiz-admin/quiz-admin.component';
import { UserAdminComponent } from './online-quiz-admin/user-admin/user-admin.component';
import { ScoreDetailAdminComponent } from './online-quiz-admin/score-detail-admin/score-detail-admin.component';
import { RegisterComponent } from './authentication/register/register.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { ChangePasswordComponent } from './authentication/change-password/change-password.component';

@NgModule({
  declarations: [
    AppComponent,
    AutoFocusDirective,
    ChoicePipe,
    RandomOrderPipe,
    UserRolePipe,
    AuthenticationComponent,
    LoginComponent,
    OnlineQuizComponent,
    OnlineQuizAdminComponent,
    NavbarUserComponent,
    MenuUserComponent,
    CategoryComponent,
    QuestionComponent,
    QuizComponent,
    NavbarAdminComponent,
    CategoryAdminComponent,
    QuestionAdminComponent,
    QuizAdminComponent,
    UserAdminComponent,
    ScoreDetailAdminComponent,
    RegisterComponent,
    ResetPasswordComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RadioButtonModule,
    CheckboxModule,
    CardModule,
    ButtonModule,
    ProgressBarModule,
    TableModule,
    InputTextModule,
    RippleModule,
    InputSwitchModule,
    ToastModule,
    ConfirmDialogModule,
    ToolbarModule,
    RatingModule,
    DialogModule,
    BrowserAnimationsModule,
    InputTextareaModule,
    MenubarModule,
    DropdownModule,
    CalendarModule,
    TagModule,
    PanelMenuModule,
    PasswordModule,
    ImageModule,
    EditorModule
  ],
  providers: [MessageService, ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
