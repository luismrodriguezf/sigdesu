import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportarCapasComponent } from './importar.component';

describe('ImportarCapasComponent', () => {
  let component: ImportarCapasComponent;
  let fixture: ComponentFixture<ImportarCapasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportarCapasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportarCapasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
