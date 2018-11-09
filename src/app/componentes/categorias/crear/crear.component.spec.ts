import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCategoriasComponent } from './crear.component';

describe('CrearCategoriasComponent', () => {
  let component: CrearCategoriasComponent;
  let fixture: ComponentFixture<CrearCategoriasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearCategoriasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearCategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
