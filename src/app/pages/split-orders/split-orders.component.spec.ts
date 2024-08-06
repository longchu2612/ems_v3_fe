import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitOrdersComponent } from './split-orders.component';

describe('SplitOrdersComponent', () => {
  let component: SplitOrdersComponent;
  let fixture: ComponentFixture<SplitOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SplitOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SplitOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
