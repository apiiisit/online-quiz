import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarManagementComponent } from './navbar-management.component';

describe('NavbarManagementComponent', () => {
  let component: NavbarManagementComponent;
  let fixture: ComponentFixture<NavbarManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
