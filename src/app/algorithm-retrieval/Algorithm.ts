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

export class AlgorithmBuilder {
  #algorithm: Partial<Algorithm> = {};

  constructor() {
    this.#algorithm.helpTextMap = new Object();
  }

  id(id: string): this {
    this.#algorithm.id = id;
    return this;
  }

  name(name: string): this {
    this.#algorithm.name = name;
    return this;
  }

  orientation(orientation: Array<string>): this {
    this.#algorithm.orientation = orientation;
    return this;
  }

  equalGroups(equalGroups: boolean): this {
    this.#algorithm.equalGroups = equalGroups;
    return this;
  }

  algorithm(algorithm: string): this {
    this.#algorithm.algorithm = algorithm;
    return this;
  }

  service(service: MatchingAlgorithm): this {
    this.#algorithm.service = service;
    return this;
  }

  description(description: string): this {
    this.#algorithm.description = description;
    return this;
  }

  helpTextMap(helpTextMap: Object): this {
    this.#algorithm.helpTextMap = helpTextMap;
    return this;
  }

  code(code: Array<string>): this {
    this.#algorithm.code = code;
    return this;
  }

  build(): Algorithm {
    return this.#algorithm as Algorithm;
  }
}
