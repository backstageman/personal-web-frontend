import { TestBed } from '@angular/core/testing';

import { ArticlesPublicService } from './articles-public.service';

describe('ArticlesPublicService', () => {
  let service: ArticlesPublicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticlesPublicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
