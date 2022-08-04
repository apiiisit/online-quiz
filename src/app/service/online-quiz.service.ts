import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OnlineQuizService {

  constructor(private http: HttpClient) { }

  getCategory() {
    return this.http.get<any>('api/category');
  }

  getQuiz(id: number) {
    return this.http.get<any>(`api/quiz/${id}`);
  }

  getQuizById(id: number) {
    return this.http.get<any>(`api/quiz/q_${id}`);
  }

  getQuestion(id: number, limit: number, time: number) {
    return this.http.get<any>(`api/question/question?quiz=${id}&limit=${limit}&time=${time}`);
  }

  login(username: string, password: string) {
    return this.http.get<any>(`api/user/auth?username=${username}&password=${password}`);
  }

  updateLastLogin(id: number) {
    return this.http.put(`api/user/lastlogin`, {userId: id});
  }
  
  getUser(id: number) {
    return this.http.get<any>(`api/user/${id}`);    
  }

  postUser(user: any) {
    return this.http.post('api/user', user);
  }

  updateUser(id: any, user: any) {
    return this.http.put(`api/user/${id}`, user);
  }

  postTask(task: any) {
    return this.http.post('api/task', task);
  }

  postUploadImage(formData: any) {
    return this.http.post('api/user/upload', formData);
  }

  getUserDoQuiz(userId: any, quizId: any) {
    return this.http.get(`api/task/check?uid=${userId}&qid=${quizId}`);
  }

}
