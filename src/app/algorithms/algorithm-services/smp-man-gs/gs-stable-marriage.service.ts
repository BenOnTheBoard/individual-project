import { Injectable } from '@angular/core';
import { MatchingAlgorithm } from '../../abstract-classes/MatchingAlgorithm';
import { Agent } from '../../interfaces/Agent';
import { AlgorithmData } from '../../interfaces/AlgorithmData';
import { Man } from '../../interfaces/Man';

@Injectable({
  providedIn: 'root',
})
export class GsStableMarriageService extends MatchingAlgorithm {
  group1Name = 'man';
  group2Name = 'woman';

  group1Agents: Map<String, Man> = new Map();

  generateAgents() {
    for (let i = 1; i < this.numberOfAgents + 1; i++) {
      const group1AgentName = this.group1Name + i;

      this.group1Agents.set(group1AgentName, {
        name: group1AgentName,
        match: new Array(),
        ranking: new Array(),
        lastProposed: 0,
      });

      this.freeAgents.push(group1AgentName);
    }

    for (let i = 0; i < this.numberOfGroup2Agents; i++) {
      const currentLetter = String.fromCharCode(65 + i);
      const group2AgentName = this.group2Name + currentLetter;

      this.group2Agents.set(group2AgentName, {
        name: group2AgentName,
        match: new Array(),
        ranking: new Array(),
      });
    }
  }

  match(): AlgorithmData {
    this.saveStep(1);

    // 2: while some man m is free do
    while (this.freeAgents.length > 0) {
      this.currentlySelectedAgents = [];
      this.relevantPreferences = [];

      const man: Man = this.group1Agents.get(this.freeAgents[0]);
      this.relevantPreferences.push(man.name.substring(3));
      this.currentlySelectedAgents.push(man.name.substring(3));

      this.saveStep(2, { '%man%': man.name });

      // 3: w = most preferred woman on m’s list to which he has not yet proposed;
      const woman: Agent = man.ranking[man.lastProposed];

      this.currentlySelectedAgents.push(woman.name.substring(5));
      this.relevantPreferences.push(woman.name.substring(5));

      const redLine = [man.name.substring(3), woman.name.substring(5), 'red'];
      this.currentLines.push(redLine);

      let greenLine = [];

      this.changePrefsStyle(
        this.currentPrefsGroup2,
        woman.name.substring(5),
        this.getRank(woman, man),
        'red',
      );
      this.changePrefsStyle(
        this.currentPrefsGroup1,
        man.name.substring(3),
        this.getRank(man, woman),
        'red',
      );

      this.saveStep(3, { '%woman%': woman.name, '%man%': man.name });

      man.lastProposed += 1;
      this.saveStep(4, { '%woman%': woman.name });

      if (woman.match.length <= 0) {
        woman.match.splice(0, 1);
        woman.match.push(man);
        man.match[0] = woman;
        this.freeAgents.shift();

        // colour preferences (for when a partner is instantly selected)
        this.changePrefsStyle(
          this.currentPrefsGroup2,
          woman.name.substring(5),
          this.getRank(woman, man),
          'green',
        );
        this.changePrefsStyle(
          this.currentPrefsGroup1,
          man.name.substring(3),
          this.getRank(man, woman),
          'green',
        );

        this.currentLines = this.removeSubArray(this.currentLines, redLine);
        greenLine = [man.name.substring(3), woman.name.substring(5), 'green'];
        this.currentLines.push(greenLine);

        this.saveStep(5, { '%woman%': woman.name, '%man%': man.name });
      } else {
        this.relevantPreferences.push(woman.match[0].name.substring(3));
        this.saveStep(6, {
          '%woman%': woman.name,
          '%man%': man.name,
          '%match%': woman.match[0].name,
        });
        const manName = man.name;
        this.changePrefsStyle(
          this.currentPrefsGroup2,
          woman.name.substring(5),
          this.getRank(woman, man),
          'red',
        );
        this.saveStep(7, {
          '%woman%': woman.name,
          '%man%': man.name,
          '%match%': woman.match[0].name,
        });

        if (
          woman.ranking.findIndex(
            (man: { name: string }) => man.name == woman.match[0].name,
          ) >
          woman.ranking.findIndex(
            (man: { name: string }) => man.name == manName,
          )
        ) {
          this.changePrefsStyle(
            this.currentPrefsGroup2,
            woman.name.substring(5),
            this.getRank(woman, woman.match[0]),
            'grey',
          );
          this.changePrefsStyle(
            this.currentPrefsGroup1,
            woman.match[0].name.substring(3),
            this.getRank(woman.match[0], woman),
            'grey',
          );
          this.changePrefsStyle(
            this.currentPrefsGroup2,
            woman.name.substring(5),
            this.getRank(woman, man),
            'green',
          );

          this.currentLines = this.removeSubArray(this.currentLines, redLine);
          this.currentLines = this.removeSubArray(this.currentLines, [
            woman.match[0].name.substring(3),
            woman.name.substring(5),
            'green',
          ]);

          const match: string = woman.match[0].name;

          this.freeAgents.push(match);
          woman.match[0] = man;

          greenLine = [man.name.substring(3), woman.name.substring(5), 'green'];
          this.currentLines.push(greenLine);

          this.changePrefsStyle(
            this.currentPrefsGroup1,
            man.name.substring(3),
            this.getRank(man, woman),
            'green',
          );

          this.freeAgents.shift();
          this.saveStep(8, {
            '%woman%': woman.name,
            '%man%': man.name,
            '%match%': match,
          });
        } else {
          this.changePrefsStyle(
            this.currentPrefsGroup1,
            man.name.substring(3),
            this.getRank(man, woman),
            'grey',
          );
          this.changePrefsStyle(
            this.currentPrefsGroup2,
            woman.name.substring(5),
            this.getRank(woman, man),
            'grey',
          );
          this.currentLines = this.removeSubArray(this.currentLines, redLine);
          this.saveStep(9, {
            '%woman%': woman.name,
            '%man%': man.name,
            '%match%': woman.match[0].name,
          });

          this.saveStep(10);
        }
      }
    }

    this.currentlySelectedAgents = [];
    this.relevantPreferences = [];

    this.saveStep(11);

    for (const woman of Array.from(this.group2Agents.values())) {
      woman.match[0].match[0] = woman;
    }

    return;
  }
}
