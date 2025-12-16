import { Injectable } from '@angular/core';
import { EgsOneToMany } from '../../abstract-classes/EgsOneToMany';
import { Agent } from '../../interfaces/Agent';
import { UtilsService } from 'src/app/utils/utils.service';

@Injectable({
  providedIn: 'root',
})
export class EgsStableMarriageService extends EgsOneToMany {
  group1Name = 'man';
  group2Name = 'woman';

  constructor(public utils: UtilsService) {
    super(utils);
  }

  shouldContinueMatching(currentAgent: Agent): boolean {
    return true;
  }

  getNextPotentialProposee(currentAgent: Agent): Agent {
    return currentAgent.ranking[0];
  }
}
