import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarCapasComponent } from './eliminar.component';

describe('EliminarCapasComponent', () => {
  let component: EliminarCapasComponent;
  let fixture: ComponentFixture<EliminarCapasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliminarCapasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliminarCapasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
