import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarCategoriasComponent } from './eliminar.component';

describe('EliminarCategoriasComponent', () => {
  let component: EliminarCategoriasComponent;
  let fixture: ComponentFixture<EliminarCategoriasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliminarCategoriasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliminarCategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
