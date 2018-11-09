import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarDatosComponent } from './agregar.component';

describe('AgregarDatosComponent', () => {
  let component: AgregarDatosComponent;
  let fixture: ComponentFixture<AgregarDatosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarDatosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
