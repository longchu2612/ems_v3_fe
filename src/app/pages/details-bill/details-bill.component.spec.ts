import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsBillComponent } from './details-bill.component';

describe('DetailsBillComponent', () => {
  let component: DetailsBillComponent;
  let fixture: ComponentFixture<DetailsBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
