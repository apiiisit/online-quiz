import { TestBed } from '@angular/core/testing';

import { HasQuizKeyGuard } from './has-quiz-key.guard';

describe('HasQuizKeyGuard', () => {
  let guard: HasQuizKeyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(HasQuizKeyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
