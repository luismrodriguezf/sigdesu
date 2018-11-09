import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCapasComponent } from './crear.component';

describe('CrearCapasComponent', () => {
  let component: CrearCapasComponent;
  let fixture: ComponentFixture<CrearCapasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearCapasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearCapasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
