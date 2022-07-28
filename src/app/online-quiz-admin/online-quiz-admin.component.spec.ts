import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineQuizAdminComponent } from './online-quiz-admin.component';

describe('OnlineQuizAdminComponent', () => {
  let component: OnlineQuizAdminComponent;
  let fixture: ComponentFixture<OnlineQuizAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineQuizAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineQuizAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
