import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServeManagementComponent } from './serve-management.component';

describe('ServeManagementComponent', () => {
  let component: ServeManagementComponent;
  let fixture: ComponentFixture<ServeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServeManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
