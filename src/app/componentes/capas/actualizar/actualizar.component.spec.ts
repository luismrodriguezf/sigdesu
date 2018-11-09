import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarCapasComponent } from './actualizar.component';

describe('ActualizarCapasComponent', () => {
  let component: ActualizarCapasComponent;
  let fixture: ComponentFixture<ActualizarCapasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActualizarCapasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualizarCapasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
