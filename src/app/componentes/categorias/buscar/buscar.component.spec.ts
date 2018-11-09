import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarCategoriasComponent } from './buscar.component';

describe('BuscarCategoriasComponent', () => {
  let component: BuscarCategoriasComponent;
  let fixture: ComponentFixture<BuscarCategoriasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscarCategoriasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarCategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
