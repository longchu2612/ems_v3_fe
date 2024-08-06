import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnFoodComponent } from './return-food.component';

describe('ReturnFoodComponent', () => {
  let component: ReturnFoodComponent;
  let fixture: ComponentFixture<ReturnFoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnFoodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnFoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
