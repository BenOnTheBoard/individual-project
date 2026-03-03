import { AlgorithmBuilder } from '../algorithm-retrieval/Algorithm';
import { AlgorithmRetrievalService } from '../algorithm-retrieval/algorithm-retrieval.service';

export const mockAlgorithmRetrievalService = {
  provide: AlgorithmRetrievalService,
  useValue: {
    numberOfG1Agents: 2,
    numberOfG2Agents: 2,
    currentAlgorithm: new AlgorithmBuilder().build(),
    irregularPluralMap: new Map([
      ['Man', 'Men'],
      ['Woman', 'Women'],
    ]),
    mapOfAvailableAlgorithms: new Map(),
    getSide: jasmine.createSpy('getSide').and.returnValue('Man'),
    getAlgorithm: jasmine.createSpy('getAlgorithm'),
    mayBeUnstable: jasmine.createSpy('mayBeUnstable').and.returnValue(true),
    marksAgents: jasmine.createSpy('marksAgents').and.returnValue(true),
  },
};
