import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizDialogComponent } from './quiz-dialog.component';

describe('QuizDialogComponent', () => {
  let component: QuizDialogComponent;
  let fixture: ComponentFixture<QuizDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
