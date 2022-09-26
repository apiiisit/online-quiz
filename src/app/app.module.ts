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
import { ChartModule } from 'primeng/chart';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ChipModule } from 'primeng/chip';
import { MenuModule } from 'primeng/menu';
import { InputNumberModule } from 'primeng/inputnumber';
import { KeyFilterModule } from 'primeng/keyfilter';
import { InputMaskModule } from 'primeng/inputmask';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

import { AutoFocusDirective } from './directive/auto-focus.directive';
import { RandomOrderPipe } from './pipe/random-order.pipe';
import { UserRolePipe } from './pipe/user-role.pipe';
import { AuthenticationComponent } from './authentication/authentication.component';
import { LoginComponent } from './authentication/login/login.component';
import { OnlineQuizComponent } from './online-quiz/online-quiz.component';
import { NavbarUserComponent } from './online-quiz/navbar-user/navbar-user.component';
import { MenuUserComponent } from './online-quiz/menu-user/menu-user.component';
import { CategoryComponent } from './online-quiz/category/category.component';
import { QuestionComponent } from './online-quiz/question/question.component';
import { QuizComponent } from './online-quiz/quiz/quiz.component';
import { RegisterComponent } from './authentication/register/register.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { ChangePasswordComponent } from './authentication/change-password/change-password.component';
import { ChartComponent } from './chart/chart.component';
import { OnlineQuizManagementComponent } from './online-quiz-management/online-quiz-management.component';
import { QuizManagementComponent } from './online-quiz-management/quiz-management/quiz-management.component';
import { ResultManagementComponent } from './online-quiz-management/result-management/result-management.component';
import { UserManagementComponent } from './online-quiz-management/user-management/user-management.component';
import { NavbarManagementComponent } from './online-quiz-management/navbar-management/navbar-management.component';
import { MenuManagementComponent } from './online-quiz-management/menu-management/menu-management.component';
import { ShowStrLenPipe } from './pipe/show-str-len.pipe';
import { DashboardManagementComponent } from './online-quiz-management/dashboard-management/dashboard-management.component';
import { UserDialogComponent } from './dialog/user-dialog/user-dialog.component';
import { QuizDialogComponent } from './dialog/quiz-dialog/quiz-dialog.component';
import { CategoryManagementComponent } from './online-quiz-management/category-management/category-management.component';
import { CategoryDialogComponent } from './dialog/category-dialog/category-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    AutoFocusDirective,
    RandomOrderPipe,
    UserRolePipe,
    AuthenticationComponent,
    LoginComponent,
    OnlineQuizComponent,
    NavbarUserComponent,
    MenuUserComponent,
    CategoryComponent,
    QuestionComponent,
    QuizComponent,
    RegisterComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
    ChartComponent,
    OnlineQuizManagementComponent,
    QuizManagementComponent,
    ResultManagementComponent,
    UserManagementComponent,
    NavbarManagementComponent,
    MenuManagementComponent,
    ShowStrLenPipe,
    DashboardManagementComponent,
    UserDialogComponent,
    QuizDialogComponent,
    CategoryManagementComponent,
    CategoryDialogComponent
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
    EditorModule,
    ChartModule,
    ScrollPanelModule,
    ChipModule,
    MenuModule,
    InputNumberModule,
    KeyFilterModule,
    InputMaskModule,
    ConfirmPopupModule
  ],
  providers: [MessageService, ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
