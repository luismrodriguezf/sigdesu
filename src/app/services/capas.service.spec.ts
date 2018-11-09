import { TestBed, inject } from '@angular/core/testing';

import { CapasService } from './capas.service';

describe('CapasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CapasService]
    });
  });

  it('should be created', inject([CapasService], (service: CapasService) => {
    expect(service).toBeTruthy();
  }));
});
