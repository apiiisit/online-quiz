import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreDetailAdminComponent } from './score-detail-admin.component';

describe('ScoreDetailAdminComponent', () => {
  let component: ScoreDetailAdminComponent;
  let fixture: ComponentFixture<ScoreDetailAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoreDetailAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreDetailAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
