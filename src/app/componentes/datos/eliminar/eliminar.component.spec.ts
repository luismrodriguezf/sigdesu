import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarDatosComponent } from './eliminar.component';

describe('EliminarDatosComponent', () => {
  let component: EliminarDatosComponent;
  let fixture: ComponentFixture<EliminarDatosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliminarDatosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliminarDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
