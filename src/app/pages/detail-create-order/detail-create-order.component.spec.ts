import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCreateOrderComponent } from './detail-create-order.component';

describe('DetailCreateOrderComponent', () => {
  let component: DetailCreateOrderComponent;
  let fixture: ComponentFixture<DetailCreateOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailCreateOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCreateOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
