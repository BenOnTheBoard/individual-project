import { TestBed } from '@angular/core/testing';
import { LayoutService } from './layout.service';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval.service';

describe('LayoutService', () => {
  let service: LayoutService;
  let mockAlgService: Partial<AlgorithmRetrievalService>;
  let mockCanvas: HTMLCanvasElement;

  beforeEach(() => {
    mockAlgService = {
      numberOfGroup1Agents: 3,
      numberOfGroup2Agents: 3,
    } as AlgorithmRetrievalService;

    TestBed.configureTestingModule({
      providers: [
        LayoutService,
        { provide: AlgorithmRetrievalService, useValue: mockAlgService },
      ],
    });

    service = TestBed.inject(LayoutService);

    mockCanvas = document.createElement('canvas');
    mockCanvas.width = 800;
    mockCanvas.height = 600;
  });
  describe('calculateBipartitePositions', () => {
    it('should calculate positions for both LHS and RHS groups', () => {
      const command = { algorithmSpecificData: {} };
      service.calculateBipartitePositions(mockCanvas, command);

      const positions = service.getPositions();
      expect(Object.keys(positions).length).toBe(7);
      expect(positions.middle).toBeDefined();

      ['circle1', 'circle2', 'circle3'].forEach((k) =>
        expect(positions[k]).toBeDefined(),
      );
      ['circleA', 'circleB', 'circleC'].forEach((k) =>
        expect(positions[k]).toBeDefined(),
      );
    });

    it('should apply hospital capacity offset when specified', () => {
      const command = { algorithmSpecificData: { hospitalCapacity: true } };
      service.calculateBipartitePositions(mockCanvas, command);

      const lhsPos = service.getPositions().circle1.x;
      expect(lhsPos).toBeCloseTo(205, 1); // 800 * 0.3 - 35 = 205
    });

    it('should handle zero agents gracefully', () => {
      mockAlgService.numberOfGroup1Agents = 0;
      mockAlgService.numberOfGroup2Agents = 0;
      const command = { algorithmSpecificData: {} };

      expect(() =>
        service.calculateBipartitePositions(mockCanvas, command),
      ).not.toThrow();
    });

    it('should use height offset map when group size matches', () => {
      mockAlgService.numberOfGroup1Agents = 8;
      const command = { algorithmSpecificData: {} };
      service.calculateBipartitePositions(mockCanvas, command);

      expect(service.getPositions().circle1).toBeDefined();
    });
  });

  describe('calculateSRPositions', () => {
    it('should place agents in a circular layout', () => {
      mockAlgService.numberOfGroup1Agents = 4;
      service.calculateSRPositions(mockCanvas);

      const positions = service.getPositions();
      expect(Object.keys(positions).length).toBe(5);
      expect(positions.middle).toBeDefined();

      ['circle1', 'circle2', 'circle3', 'circle4'].forEach((k) =>
        expect(positions[k]).toBeDefined(),
      );
    });

    it('should handle zero agents gracefully', () => {
      mockAlgService.numberOfGroup1Agents = 0;
      expect(() => service.calculateSRPositions(mockCanvas)).not.toThrow();
    });
  });

  describe('getPositionOfAgent', () => {
    beforeEach(() => {
      service.setPositions({
        testAgent: { x: 100, y: 200 },
      });
    });

    it('should return correct coordinates for known agent', () => {
      const pos = service.getPositionOfAgent('testAgent');
      expect(pos.x).toBe(100);
      expect(pos.y).toBe(200);
    });

    it('should throw an error for unknown agent', () => {
      expect(() => service.getPositionOfAgent('unknown')).toThrowError(
        'Position not found for agent: unknown',
      );
    });
  });
});
