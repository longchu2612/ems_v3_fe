import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsTransactionsComponent } from './details-transactions.component';

describe('DetailsTransactionsComponent', () => {
  let component: DetailsTransactionsComponent;
  let fixture: ComponentFixture<DetailsTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsTransactionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
