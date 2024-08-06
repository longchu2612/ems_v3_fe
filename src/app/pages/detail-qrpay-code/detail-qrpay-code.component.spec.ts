import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailQrpayCodeComponent } from './detail-qrpay-code.component';

describe('DetailQrpayCodeComponent', () => {
  let component: DetailQrpayCodeComponent;
  let fixture: ComponentFixture<DetailQrpayCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailQrpayCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailQrpayCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
