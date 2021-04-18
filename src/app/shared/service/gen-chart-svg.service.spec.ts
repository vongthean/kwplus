import { TestBed } from '@angular/core/testing';

import { GenChartSvgService } from './gen-chart-svg.service';

describe('GenChartSvgService', () => {
  let service: GenChartSvgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenChartSvgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
