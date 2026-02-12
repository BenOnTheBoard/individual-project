import { Injectable } from '@angular/core';
import { MatchingAlgorithm } from '../../abstract-classes/MatchingAlgorithm';
import { Man, Woman } from '../../interfaces/Agents';
import { AlgorithmData } from '../../interfaces/AlgorithmData';

@Injectable({
  providedIn: 'root',
})
export class GsStableMarriageService extends MatchingAlgorithm {
  group1Name = 'man';
  group2Name = 'woman';

  freeAgents: Array<Man>;
  group1Agents: Map<String, Man> = new Map();

  generateAgents() {
    for (let i = 1; i < this.numberOfAgents + 1; i++) {
      const group1AgentName = this.group1Name + i;
      const agent: Man = {
        name: group1AgentName,
        match: new Array(),
        ranking: new Array(),
        lastProposed: undefined,
      };
      this.group1Agents.set(group1AgentName, agent);
      this.freeAgents.push(agent);
    }

    for (let i = 0; i < this.numberOfGroup2Agents; i++) {
      const currentLetter = String.fromCharCode(65 + i);
      const group2AgentName = this.group2Name + currentLetter;
      const agent: Woman = {
        name: group2AgentName,
        match: new Array(),
        ranking: new Array(),
      };
      this.group2Agents.set(group2AgentName, agent);
    }
  }

  incrementLastProposed(man: Man): void {
    const rank = this.getOriginalRank(man, man.lastProposed, 'group1');
    man.lastProposed = man.ranking[rank + 1];
  }

  match(): AlgorithmData {
    for (const man of Array.from(this.group1Agents.values())) {
      man.lastProposed = man.ranking[0];
    }

    this.saveStep(1);

    // 2: while some man m is free do
    while (this.freeAgents.length > 0) {
      this.selectedAgents = [];
      this.relevantPrefs = [];

      const man = this.freeAgents[0];
      const woman = man.lastProposed;
      const match = woman.match[0];

      this.relevantPrefs.push(this.utils.getAsChar(man));
      this.selectedAgents.push(this.utils.getAsChar(man));

      this.saveStep(2, { '%man%': man.name });

      this.selectedAgents.push(this.utils.getAsChar(woman));
      this.relevantPrefs.push(this.utils.getAsChar(woman));

      this.addLine(man, woman, 'red');
      this.stylePrefsMutual(man, woman, 'red');

      this.saveStep(3, { '%woman%': woman.name, '%man%': man.name });

      this.incrementLastProposed(man);
      this.saveStep(4, { '%woman%': woman.name });

      if (woman.match.length <= 0) {
        woman.match.splice(0, 1);
        woman.match.push(man);
        man.match[0] = woman;
        this.freeAgents.shift();

        this.changeLineColour(man, woman, 'red', 'green');
        this.stylePrefsMutual(man, woman, 'green');

        this.saveStep(5, { '%woman%': woman.name, '%man%': man.name });
      } else {
        this.relevantPrefs.push(this.utils.getAsChar(match));
        this.saveStep(6, {
          '%woman%': woman.name,
          '%man%': man.name,
          '%match%': match.name,
        });
        this.stylePrefs('group2', woman, man, 'red');
        this.saveStep(7, {
          '%woman%': woman.name,
          '%man%': man.name,
          '%match%': match.name,
        });

        if (this.getRank(woman, match) > this.getRank(woman, man)) {
          this.stylePrefsMutual(match, woman, 'grey');
          this.stylePrefsMutual(man, woman, 'green');
          this.changeLineColour(man, woman, 'red', 'green');
          this.removeLine(match, woman, 'green');

          this.freeAgents.push(match);
          this.freeAgents.shift();
          woman.match[0] = man;

          this.saveStep(8, {
            '%woman%': woman.name,
            '%man%': man.name,
            '%match%': match.name,
          });
        } else {
          this.stylePrefsMutual(man, woman, 'grey');
          this.removeLine(man, woman, 'red');
          this.saveStep(9, {
            '%woman%': woman.name,
            '%man%': man.name,
            '%match%': match.name,
          });

          this.saveStep(10);
        }
      }
    }

    this.selectedAgents = [];
    this.relevantPrefs = [];

    this.saveStep(11);

    for (const woman of Array.from(this.group2Agents.values())) {
      woman.match[0].match[0] = woman;
    }

    return;
  }
}
