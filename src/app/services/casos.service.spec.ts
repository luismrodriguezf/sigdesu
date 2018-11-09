import { TestBed, inject } from '@angular/core/testing';

import { CasosService } from './casos.service';

describe('CasosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CasosService]
    });
  });

  it('should be created', inject([CasosService], (service: CasosService) => {
    expect(service).toBeTruthy();
  }));
});
