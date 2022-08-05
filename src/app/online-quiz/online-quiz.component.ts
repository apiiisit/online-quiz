import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-online-quiz',
  templateUrl: './online-quiz.component.html',
  styleUrls: ['./online-quiz.component.scss']
})
export class OnlineQuizComponent implements OnInit {

  imageSrc: any;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.imageSrc = this.authService.profileUrl;
  }

}
