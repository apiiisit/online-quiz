import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineQuizManagementComponent } from './online-quiz-management.component';

describe('OnlineQuizManagementComponent', () => {
  let component: OnlineQuizManagementComponent;
  let fixture: ComponentFixture<OnlineQuizManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineQuizManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineQuizManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
