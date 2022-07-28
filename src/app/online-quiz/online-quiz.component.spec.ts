import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineQuizComponent } from './online-quiz.component';

describe('OnlineQuizComponent', () => {
  let component: OnlineQuizComponent;
  let fixture: ComponentFixture<OnlineQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineQuizComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
