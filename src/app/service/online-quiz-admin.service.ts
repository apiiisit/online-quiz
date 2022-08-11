import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class OnlineQuizAdminService {

  constructor(private http: HttpClient, private messageService: MessageService) { }

  alertMsg(type: string, title: string, detail: string) {
    return this.messageService.add({ severity: type, summary: title, detail: detail, life: 3000 });
  }

  // category
  getCategory() {
    return this.http.get<any>('api/category/admin');
  }

  newCategory(category: any) {
    return this.http.post('api/category', category);
  }

  updateCategory(category: any) {
    return this.http.put(`api/category/${category.categoryId}`, category);
  }

  deleteCategory(category: any) {
    return this.http.delete(`api/category/${category.categoryId}`);
  }
  
  // quiz
  getQuiz() {
    return this.http.get<any>('api/quiz/admin');
  }

  newQuiz(quiz: any) {
    return this.http.post('api/quiz', quiz);
  }

  updateQuiz(quiz: any) {
    return this.http.put(`api/quiz/${quiz.quizId}`, quiz);
  }

  deleteQuiz(quiz: any) {
    return this.http.delete(`api/quiz/${quiz.quizId}`);
  }

  // question
  getQuestion() {
    return this.http.get<any>('api/question/admin');
  }

  newQuestion(question: any) {
    return this.http.post('api/question', question);
  }

  updateQuestion(question: any) {
    return this.http.put(`api/question/${question.questionId}`, question);
  }

  deleteQuestion(question: any) {
    return this.http.delete(`api/question/${question.questionId}`);
  }

  // choice
  newChoice(choice: any) {
    return this.http.post('api/choice', choice);
  }

  updateChoice(choice: any) {
    return this.http.put(`api/choice/${choice.choiceId}`, choice);
  }

  deleteChoice(choice: any) {
    return this.http.delete(`api/choice/${choice.choiceId}`);
  }

  // choice correct
  getchoiceCorrect() {
    return this.http.get<any>('api/choice_correct');
  }

  // user
  getUser() {
    return this.http.get<any>('api/user');
  }

  newUser(user: any) {
    return this.http.post('api/user', user);
  }

  updateUser(user: any) {
    return this.http.put(`api/user/${user.userId}`, user);
  }

  deleteUser(user: any) {
    return this.http.delete(`api/user/${user.userId}`);
  }

  // task
  getTask() {
    return this.http.get<any>('api/task');
  }

  deleteTask(task: any) {
    return this.http.delete(`api/task/${task.taskId}`);
  }


}
