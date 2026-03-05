import { Injectable } from '@angular/core';
import { SR } from '../../abstract-classes/problem-definitions/SR';
import { Person } from '../../interfaces/Agents';

@Injectable({
  providedIn: 'root',
})
export class StableRoomIrvService extends SR {
  styleAssignment(person: Person): void {
    this.removeEveryLineFrom(person);
    this.removeEveryLineTo(person.lastProposed);
    this.removeEveryLineFrom(person.lastProposed);
    this.stylePrefs('group1', person, person.ranking[0], 'green');
    this.addLine(person, person.lastProposed, 'green');
  }

  removeEveryLineFrom(person: Person): void {
    this.currentLines = this.removePerson(
      this.currentLines,
      this.utils.getAsChar(person),
    );
  }

  removeEveryLineTo(person: Person): void {
    this.currentLines = this.removeTarget(
      this.currentLines,
      this.utils.getAsChar(person),
    );
  }

  // checks is anyone is assigned to a person, returns assigned person if true, null otherwise
  assignCheck(assigned: String): String | null {
    for (const [key, person] of this.group1Agents.entries()) {
      // if assigned then
      if (person.lastProposed != null && person.lastProposed.name == assigned) {
        return key;
      }
    }
    return null;
  }

  delete(agent: Person, target: Person): void {
    const rank = this.getRank(agent, target);
    if (rank == -1) return;
    agent.ranking.splice(rank, 1);
    this.stylePrefs('group1', agent, target, 'grey');
  }

  deletePair(agent1: Person, agent2: Person): void {
    this.delete(agent1, agent2);
    this.delete(agent2, agent1);
  }

  getFreeAgents(): Map<String, Person> {
    return new Map(
      Array.from(this.group1Agents.entries()).filter(
        ([_, person]) => person.lastProposed == null,
      ),
    );
  }

  getAgentsWithMultiplePrefs(): Map<String, Person> {
    return new Map(
      Array.from(this.group1Agents.entries()).filter(
        ([_, person]) => person.ranking.length > 1,
      ),
    );
  }

  existsEmptyList(): boolean {
    return Array.from(this.group1Agents.values()).some(
      (person) => person.ranking.length == 0,
    );
  }

  rankingToString(ranking: Array<Person>): string {
    return ranking.map((person) => person.name).join(', ');
  }

  freeUp(personToFree: String): void {
    for (const person of this.group1Agents.values()) {
      if (
        person.lastProposed != null &&
        person.lastProposed.name == personToFree
      ) {
        this.saveStep(8, {
          '%old_person%': person.name,
          '%selected%': personToFree,
        });
        this.removeEveryLineFrom(person);
        this.freeAgents.push(person);
        person.lastProposed = null;
      }
    }
  }

  phaseOne(): boolean {
    let freeAgents = this.getFreeAgents();
    let prevPerson: Person;
    let prevPref: Person;
    this.saveStep(1);

    while (freeAgents.size > 0) {
      this.selectedAgents = [];
      this.relevantPrefs = [];

      for (const person of freeAgents.values()) {
        this.saveStep(2, { '%person%': person.name });
        this.saveStep(3, { '%person%': person.name });

        if (person.ranking.length < 1) {
          this.saveStep(4);
          return false;
        }

        if (prevPerson != null) {
          this.stylePrefs('group1', prevPerson, prevPref, 'black');
        }

        prevPerson = person;
        prevPref = person.ranking[0];
        const pref = person.ranking[0];

        this.stylePrefs('group1', person, pref, 'red');
        this.saveStep(5, {
          '%person%': person.name,
          '%selected%': pref.name,
        });

        this.freeAgents.shift();

        this.addLine(person, pref, 'red');
        this.saveStep(6, { '%person%': person.name, '%selected%': pref.name });
        this.saveStep(7, { '%person%': person.name, '%selected%': pref.name });

        if (this.assignCheck(pref.name) != null) {
          this.freeUp(pref.name);
        }

        person.lastProposed = pref;

        this.saveStep(9, {
          '%person%': person.name,
          '%selected%': pref.name,
          '%list%': this.rankingToString(pref.ranking),
        });

        let remove: Person;
        do {
          remove = pref.ranking.slice(-1)[0];
          if (remove.name != person.name) {
            this.deletePair(pref, remove);
            this.saveStep(10, {
              '%person%': person.name,
              '%removee%': remove.name,
            });
          }
        } while (remove.name != person.name);

        freeAgents = this.getFreeAgents();
      }
    }

    // fix last highlights number
    this.stylePrefs('group1', prevPerson, prevPref, 'black');
    return true;
  }

  phaseTwo(): boolean {
    let multiplePrefsAgents = this.getAgentsWithMultiplePrefs();
    const finishedPeople = [];

    while (multiplePrefsAgents.size > 0) {
      for (const person of multiplePrefsAgents.values()) {
        this.saveStep(11, {
          '%person%': person.name,
          '%list%': this.rankingToString(person.ranking),
        });
        this.saveStep(12, { '%person%': person.name });

        let secondPref = person.ranking[1]; //the starting persons second preferred person
        let prevPref = secondPref.ranking.slice(-1)[0]; //the second preferred person's last preferred person
        const rotationPairs = [[prevPref, secondPref]];

        // Loop until there is a loop through people until back to the starting person
        let counter = 0;
        while (person != secondPref) {
          counter++;

          // stops infinite loops - break if there is no cycle through all the people
          if (
            counter > multiplePrefsAgents.size ||
            multiplePrefsAgents.get(prevPref.name) == null
          ) {
            break;
          }

          secondPref = multiplePrefsAgents.get(prevPref.name).ranking[1]; // update to be second pref of prevPref
          prevPref = secondPref.ranking.slice(-1)[0]; // update like above with new secondPref
          rotationPairs.push([prevPref, secondPref]);
        }

        this.saveStep(13);

        const deletedPairs = [];
        for (const pair of rotationPairs) {
          if (deletedPairs.includes(pair)) {
            // everything deleted
            break;
          } else {
            this.deletePair(pair[0], pair[1]);
            deletedPairs.push(pair);

            this.saveStep(14, {
              '%person%': pair[1].name,
              '%removee%': pair[0].name,
            });

            for (const innerPerson of this.group1Agents.values()) {
              if (
                innerPerson.ranking.length == 1 &&
                !finishedPeople.includes(innerPerson.name)
              ) {
                // let innerPerson propose to their last remaining person
                innerPerson.lastProposed = innerPerson.ranking[0];
                this.styleAssignment(innerPerson);
                finishedPeople.push(person);
              }
            }
          }
        }

        // conditions to end if stable matching is found
        multiplePrefsAgents = this.getAgentsWithMultiplePrefs();
        if (multiplePrefsAgents.size < 1) break;
        this.saveStep(15);

        for (const innerPerson of this.group1Agents.values()) {
          if (innerPerson.ranking.length == 1) {
            innerPerson.lastProposed = innerPerson.ranking[0];
            this.saveStep(16, {
              '%person%': innerPerson.name,
              '%preference%': innerPerson.lastProposed.name,
            });
          }
        }

        this.saveStep(17, { '%person%': person.name });

        if (this.existsEmptyList()) {
          this.saveStep(18);
          return false;
        }
        // needed to rest the for loop for the new values within the many_pref_list
        // this list is updated to remove people that no longer have many preferences
        break;
      }
    }
    return true;
  }

  finaliseMatching(): void {
    for (const person of this.group1Agents.values()) {
      if (person.ranking.length != 1) continue;
      // update value in list
      this.stylePrefs('group1', person, person.ranking[0], 'green');
      this.removeEveryLineFrom(person);
      this.removeEveryLineTo(person.lastProposed);
      person.lastProposed = person.ranking[0];
      this.addLine(person, person.lastProposed, 'green');
    }
  }

  match(): boolean {
    if (!this.phaseOne() || !this.phaseTwo()) return false;
    if (this.getAgentsWithMultiplePrefs().size == 0) {
      this.finaliseMatching();
    }
    this.saveStep(19);
    return true;
  }
}
