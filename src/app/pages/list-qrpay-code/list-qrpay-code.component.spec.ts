import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListQrpayCodeComponent } from './list-qrpay-code.component';

describe('ListQrpayCodeComponent', () => {
  let component: ListQrpayCodeComponent;
  let fixture: ComponentFixture<ListQrpayCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListQrpayCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListQrpayCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
