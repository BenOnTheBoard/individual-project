import { Injectable } from '@angular/core';
import { TiedMatchingAlgorithm } from '../../abstract-classes/TiedMatchingAlgorithm.service';
import { TiedAgent } from '../../interfaces/tied/TiedAgent';
import { TiedAlgorithmData } from '../../interfaces/tied/TiedAlgorithmData';

@Injectable({
  providedIn: 'root',
})
export class SmtSuperService extends TiedMatchingAlgorithm {
  group1Name = 'man';
  group2Name = 'woman';

  shouldContinueMatching(currentAgent: TiedAgent): boolean {
    return true;
  }

  match(): TiedAlgorithmData {
    // TODO: Implement super-stable matching algorithm
    return this.algorithmData;
  }

  breakAssignment(
    currentAgent: TiedAgent,
    potentialProposee: TiedAgent
  ): void {}

  provisionallyAssign(
    currentAgent: TiedAgent,
    potentialProposee: TiedAgent
  ): void {}

  removeRuledOutPreferences(
    currentAgent: TiedAgent,
    potentialProposee: TiedAgent
  ): void {}
}
