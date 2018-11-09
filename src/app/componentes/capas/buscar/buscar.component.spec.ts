import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarCapasComponent } from './buscar.component';

describe('BuscarCapasComponent', () => {
  let component: BuscarCapasComponent;
  let fixture: ComponentFixture<BuscarCapasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscarCapasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarCapasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
