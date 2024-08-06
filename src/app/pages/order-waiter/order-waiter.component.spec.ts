import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderWaiterComponent } from './order-waiter.component';

describe('OrderWaiterComponent', () => {
  let component: OrderWaiterComponent;
  let fixture: ComponentFixture<OrderWaiterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderWaiterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderWaiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
