import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailBankaccountComponent } from './detail-bankaccount.component';

describe('DetailBankaccountComponent', () => {
  let component: DetailBankaccountComponent;
  let fixture: ComponentFixture<DetailBankaccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailBankaccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailBankaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
