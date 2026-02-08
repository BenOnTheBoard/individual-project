import { MatchingAlgorithm } from '../algorithms/abstract-classes/MatchingAlgorithm';

export interface Algorithm {
  id: string;
  name: string;
  orientation: Array<string>;
  equalGroups: boolean;
  algorithm: string;
  service: MatchingAlgorithm;
  description: string;
  helpTextMap: Object; // map<number, string>
  code: Array<string>;
}
