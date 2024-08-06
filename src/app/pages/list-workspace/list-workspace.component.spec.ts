import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWorkspaceComponent } from './list-workspace.component';

describe('ListWorkspaceComponent', () => {
  let component: ListWorkspaceComponent;
  let fixture: ComponentFixture<ListWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListWorkspaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
