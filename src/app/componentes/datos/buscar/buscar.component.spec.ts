import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarDatosComponent } from './buscar.component';

describe('BuscarDatosComponent', () => {
  let component: BuscarDatosComponent;
  let fixture: ComponentFixture<BuscarDatosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscarDatosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
