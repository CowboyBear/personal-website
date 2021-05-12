import { TestBed } from '@angular/core/testing';

import { WebSiteContentService } from './web-site-content.service';

describe('WebSiteContentService', () => {
  let service: WebSiteContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSiteContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
