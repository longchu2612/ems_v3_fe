import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitchensComponent } from './kitchens.component';

describe('KitchensComponent', () => {
  let component: KitchensComponent;
  let fixture: ComponentFixture<KitchensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KitchensComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KitchensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
