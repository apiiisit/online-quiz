import { TestBed } from '@angular/core/testing';

import { OnlineQuizAdminService } from './online-quiz-admin.service';

describe('OnlineQuizAdminService', () => {
  let service: OnlineQuizAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnlineQuizAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
