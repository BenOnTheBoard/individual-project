import { Injectable } from '@angular/core';
import { SR } from '../../abstract-classes/problem-definitions/SR';
import { Person } from '../../interfaces/Agents';

@Injectable({
  providedIn: 'root',
})
export class StableRoomIrvService extends SR {
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
    for (let [key, person] of this.group1Agents.entries()) {
      // if assigned then
      if (person.lastProposed != null && person.lastProposed.name == assigned) {
        return key;
      }
    }
    return null;
  }

  // makes sure noone is assigned to person "free"
  // loop through all people - if they are - assign them to null
  free(personToFree: String): void {
    for (const person of this.group1Agents.values()) {
      // if assigned then set to null
      if (
        person.lastProposed != null &&
        person.lastProposed.name == personToFree
      ) {
        //free a
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

  deletePair(agent1: Person, agent2: Person): void {
    const agent1Rank = this.getRank(agent2, agent1);
    const agent2Rank = this.getRank(agent1, agent2);
    if (agent1Rank != -1) {
      agent2.ranking.splice(agent1Rank, 1);
    }
    if (agent2Rank != -1) {
      agent1.ranking.splice(agent2Rank, 1);
    }

    // can't use stylePrefsMutual, because these are of the same group
    this.stylePrefs('group1', agent1, agent2, 'grey');
    this.stylePrefs('group1', agent2, agent1, 'grey');
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

  match(): boolean {
    let freeAgents: Map<String, Person> = new Map();
    freeAgents = this.getFreeAgents();

    // Set each person to be free
    this.saveStep(1);

    let prevPerson: Person;
    let prevPref: Person;

    while (freeAgents.size > 0) {
      this.selectedAgents = [];
      this.relevantPrefs = [];

      //loop through each agent in the list
      for (const person of freeAgents.values()) {
        //While some person p is free (not assigned to someone)
        this.saveStep(2, { '%person%': person.name });

        //if person p has a empty preference list
        this.saveStep(3, { '%person%': person.name });

        // if there is no more preferences for a agent - no stable matchong exists
        if (person.ranking.length < 1) {
          //end - no stable mathcing
          this.saveStep(4);
          return false;
        }

        // change prevouis highlights back to black
        if (prevPerson != null) {
          this.stylePrefs('group1', prevPerson, prevPref, 'black');
        }

        // store prevouis person
        prevPerson = person;
        prevPref = person.ranking[0];
        //highlight pref in persons list
        this.stylePrefs('group1', person, person.ranking[0], 'red');

        //person b := first preference on p's list
        this.saveStep(5, {
          '%person%': person.name,
          '%selected%': person.ranking[0].name,
        });

        const pref = person.ranking[0];
        this.addLine(person, pref, 'red');

        // update free agents - remove first elm
        this.freeAgents.shift();

        //assign p to b
        this.saveStep(6, { '%person%': person.name, '%selected%': pref.name });

        //if someone is assigned to their most preferred person, then unassign them and assign current agent to them
        const check = this.assignCheck(pref.name);

        // if any person a is assigned to person b
        this.saveStep(7, { '%person%': person.name, '%selected%': pref.name });

        if (check != null) {
          this.free(pref.name);
        }

        person.lastProposed = pref;

        this.saveStep(9, {
          '%person%': person.name,
          '%selected%': pref.name,
          '%list%': this.rankingToString(pref.ranking),
        });
        // loop through ranking
        while (true) {
          // get last elm of ranking
          const remove = pref.ranking.slice(-1)[0];

          // if elm is the current person then stop
          if (remove.name == person.name) {
            break;
          }

          this.deletePair(pref, remove);

          // for each person c less preferred than p on b's, preference list
          this.saveStep(10, {
            '%person%': person.name,
            '%removee%': remove.name,
          });
        }

        freeAgents = this.getFreeAgents();
      }
    }

    // fix last highlights number
    this.stylePrefs('group1', prevPerson, prevPref, 'black');

    let multiplePrefsAgents = this.getAgentsWithMultiplePrefs();

    ////// PHASE 2

    // while there are agents that have more than 1 person in their preference list
    const finishedPeople = [];

    while (multiplePrefsAgents.size > 0) {
      //loop through those^ agents
      for (const person of multiplePrefsAgents.values()) {
        // While some person p has more than 1 preference left
        this.saveStep(11, {
          '%person%': person.name,
          '%list%': this.rankingToString(person.ranking),
        });

        // look for rotations in perosn p's preference list
        this.saveStep(12, { '%person%': person.name });

        const rotationPairs = [];

        let secondPref = person.ranking[1]; //the starting persons second preferred person
        let prevPref = secondPref.ranking.slice(-1)[0]; //the second preferned persons last preferred person

        // list of pairs to call delete on
        rotationPairs.push([prevPref, secondPref]);

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

          // add to list
          rotationPairs.push([prevPref, secondPref]);
        }

        // if rotation r is found
        this.saveStep(13, {
          '%rotation%': this.rankingToString(rotationPairs),
        }); // temp remove %rotation%

        const deletedPairs = [];
        for (const pair of rotationPairs) {
          // if pair not already deleted
          if (deletedPairs.includes(pair)) {
            // everything deleted
            break;
          } else {
            this.deletePair(pair[0], pair[1]);
            deletedPairs.push(pair);

            // delete pairs in rotation r
            this.saveStep(14, {
              '%person%': pair[1].name,
              '%removee%': pair[0].name,
            });

            // update lines
            for (const innerPerson of this.group1Agents.values()) {
              if (
                innerPerson.ranking.length == 1 &&
                !finishedPeople.includes(innerPerson.name)
              ) {
                this.removeEveryLineFrom(innerPerson);

                // let innerPerson propose to their last remaining person
                innerPerson.lastProposed = innerPerson.ranking.slice(0)[0];

                this.removeEveryLineTo(innerPerson.lastProposed);
                this.removeEveryLineFrom(innerPerson.lastProposed);

                // update value in list
                this.stylePrefs(
                  'group1',
                  innerPerson,
                  innerPerson.ranking[0],
                  'green',
                );
                this.addLine(innerPerson, innerPerson.lastProposed, 'green');

                finishedPeople.push(person);
              }
            }
          }
        }

        // conditions to end if stable matching is found
        multiplePrefsAgents = this.getAgentsWithMultiplePrefs();

        if (multiplePrefsAgents.size < 1) {
          break;
        }

        // if a person b has 1 perferance left
        this.saveStep(15);

        // update preferences
        for (const innerPerson of this.group1Agents.values()) {
          if (innerPerson.ranking.length == 1) {
            innerPerson.lastProposed = innerPerson.ranking.slice(0)[0];

            // person b := last preference
            this.saveStep(16, {
              '%person%': innerPerson.name,
              '%preference%': innerPerson.lastProposed.name,
            });
          }
        }

        // if any people have empty preference lists - no mathcong
        this.saveStep(17, { '%person%': person.name });

        if (this.existsEmptyList() == true) {
          // end - no stable matching
          this.saveStep(18);
          return false;
        }
        // needed to rest the for loop for the new values within the many_pref_list
        // this list is updated to remove people that no longer have many preferences
        break;
      }
    }

    // if PHASE 2 is not done - update viz
    if (multiplePrefsAgents.size == 0) {
      for (const innerPerson of this.group1Agents.values()) {
        if (innerPerson.ranking.length == 1) {
          // update value in list
          this.stylePrefs(
            'group1',
            innerPerson,
            innerPerson.ranking[0],
            'green',
          );
          this.removeEveryLineFrom(innerPerson);
          this.removeEveryLineTo(innerPerson.lastProposed);
          innerPerson.lastProposed = innerPerson.ranking.slice(0)[0];
          this.addLine(innerPerson, innerPerson.lastProposed, 'green');
        }
      }
    }

    this.saveStep(19);
    return true;
  }
}
