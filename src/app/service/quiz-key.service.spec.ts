import { TestBed } from '@angular/core/testing';

import { QuizKeyService } from './quiz-key.service';

describe('QuizKeyService', () => {
  let service: QuizKeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizKeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
