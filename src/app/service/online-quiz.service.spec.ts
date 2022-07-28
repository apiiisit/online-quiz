import { TestBed } from '@angular/core/testing';

import { OnlineQuizService } from './online-quiz.service';

describe('OnlineQuizService', () => {
  let service: OnlineQuizService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnlineQuizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
