import { Injectable } from '@angular/core';
import { SR } from '../../abstract-classes/problem-definitions/SR/SR';
import { AlgorithmData } from '../../interfaces/AlgorithmData';
import { Person } from '../../interfaces/Agents';

@Injectable({
  providedIn: 'root',
})
export class StableRoomIrvService extends SR {
  // checks is anyone is assigned to a person, returns assigned person if true, null otherwise
  assign_check(assinged: String) {
    for (let [key, person] of this.group1Agents.entries()) {
      // if assigned then
      if (person.lastProposed != null && person.lastProposed.name == assinged) {
        return key;
      }
    }
    return null;
  }

  // makes sure noone is assigned to person "free"
  // loop through all people - if they are - assign them to null
  free(person_free: String) {
    for (const person of this.group1Agents.values()) {
      // if assigned then set to null
      if (
        person.lastProposed != null &&
        person.lastProposed.name == person_free
      ) {
        //free a
        this.saveStep(8, {
          '%old_person%': person.name,
          '%selected%': person_free,
        });

        this.currentLines = this.removePerson(
          this.currentLines,
          this.utils.getAsChar(person),
        );
        // add new free person to list
        this.freeAgents.push(person);
        person.lastProposed = null;
      }
    }
  }

  delete_pair(agent1, agent2) {
    const agent1Rank = this.getRank(agent2, agent1);
    if (agent1Rank != -1) {
      agent2.ranking.splice(agent1Rank, 1);
    }

    const agent2Rank = this.getRank(agent1, agent2);
    if (agent2Rank != -1) {
      agent1.ranking.splice(agent2Rank, 1);
    }

    // can't use stylePrefsMutual, because these are of the same group
    this.stylePrefs('group1', agent1, agent2, 'grey');
    this.stylePrefs('group1', agent2, agent1, 'grey');
  }

  // returns a map of agents that are free - not assigned to anyone
  check_free_agents() {
    const free_agents: Map<String, Person> = new Map();

    for (let [key, person] of this.group1Agents.entries()) {
      // if assigned then
      if (person.lastProposed == null) {
        free_agents.set(key, person);
      }
    }
    return free_agents;
  }

  // returns a list of the agent keys that have more than one preferance
  check_pref_count() {
    const agents_multiple_prefs: Map<String, Person> = new Map();

    for (let [key, person] of this.group1Agents.entries()) {
      // if person has more than one person in their ranking
      if (person.ranking.length > 1) {
        agents_multiple_prefs.set(key, person);
      }
    }
    return agents_multiple_prefs;
  }

  // checks if any preferance lists are empty
  check_pref_list_empty() {
    for (const person of this.group1Agents.values()) {
      if (person.ranking.length < 1) {
        return true;
      }
    }
    return false;
  }

  // returns a persons ranking as a string
  objs_toString(ranking) {
    let s = '';

    // go through each ranking and add to string
    for (const person of ranking) {
      s += person.name;
      s += ', ';
    }

    // remove extra comma added before
    s = s.slice(0, -2);
    return s;
  }

  match(): AlgorithmData {
    let free_agents: Map<String, Person> = new Map();
    free_agents = this.check_free_agents();

    // Set each person to be free
    this.saveStep(1);

    let last_person: Person;
    let last_pref: Person;

    while (free_agents.size > 0) {
      this.selectedAgents = [];
      this.relevantPrefs = [];

      //loop through each agent in the list
      for (const person of free_agents.values()) {
        //While some person p is free (not assigned to someone)
        this.saveStep(2, { '%person%': person.name });

        //if person p has a empty preferance list
        this.saveStep(3, { '%person%': person.name });

        // if there is no more preferances for a agent - no stable matchong exists
        if (person.ranking.length < 1) {
          //end - no stable mathcing
          this.saveStep(4);

          // if stable == true then regenerate
          if (this.SRstable) {
            this.run(
              this.numberOfAgents,
              this.numberOfGroup2Agents,
              this.SRstable,
            );
          }

          return;
        }

        // change prevouis highlights back to black
        if (last_person != null) {
          this.stylePrefs('group1', last_person, last_pref, 'black');
        }

        // store prevouis person
        last_person = person;
        last_pref = person.ranking[0];
        //highlight pref in persons list
        this.stylePrefs('group1', person, person.ranking[0], 'red');

        //person b := first preferance on p's list
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

        //if someone is assigned to their most prefered person, then unassign them and assign current agent to them
        const check = this.assign_check(pref.name);

        // if any person a is assigned to person b
        this.saveStep(7, { '%person%': person.name, '%selected%': pref.name });

        if (check != null) {
          this.free(pref.name);
        }

        person.lastProposed = pref;

        this.saveStep(9, {
          '%person%': person.name,
          '%selected%': pref.name,
          '%list%': this.objs_toString(pref.ranking),
        });
        // loop through ranking
        while (true) {
          //get last elm of ranking
          const remove = pref.ranking.slice(-1)[0];

          // if elm is the current person then stop
          if (remove.name == person.name) {
            break;
          }

          //delele elm from pref ranking list
          // delete perd from elm ranking list
          this.delete_pair(pref, remove);

          // for each person c less preferded than p on b's, preferance list
          this.saveStep(10, {
            '%person%': person.name,
            '%removee%': remove.name,
          });
        }

        free_agents = this.check_free_agents();
      }
    }

    // fix last highlights number
    this.stylePrefs('group1', last_person, last_pref, 'black');

    let agents_multiple_prefs = this.check_pref_count();

    ////// PAHSE 2

    // while there are agents that have more than 1 person in their prefrance list
    const finished_people = [];

    while (agents_multiple_prefs.size > 0) {
      //loop through those^ agents
      for (const person of agents_multiple_prefs.values()) {
        // While some person p has more than 1 preferance left
        this.saveStep(11, {
          '%person%': person.name,
          '%list%': this.objs_toString(person.ranking),
        });

        // look for rotations in perosn p's preferance list
        this.saveStep(12, { '%person%': person.name });

        const rotation_pairs = [];

        let second_pref = person.ranking[1]; //the starting persons second prefered person
        let last_pref = second_pref.ranking.slice(-1)[0]; //the second preferned persons last preferd person

        // list of pairs to call delete on
        rotation_pairs.push([last_pref, second_pref]);

        // Loop until there is a loop through people until back to the starting person

        let counter = 0;
        while (person != second_pref) {
          counter++;

          // stops infinite loops - break if there is no cycle through all the people
          if (
            counter > agents_multiple_prefs.size ||
            agents_multiple_prefs.get(last_pref.name) == null
          ) {
            break;
          }

          second_pref = agents_multiple_prefs.get(last_pref.name).ranking[1]; // update to be second pref of last_pref
          last_pref = second_pref.ranking.slice(-1)[0]; // update like above with new second_pref

          // add to list
          rotation_pairs.push([last_pref, second_pref]);
        }

        // if rotation r is found
        this.saveStep(13, { '%rotation%': this.objs_toString(rotation_pairs) }); // temp remove %rotation%

        const deleted_pairs = [];
        for (const pair of rotation_pairs) {
          // if pair not already deleted
          if (deleted_pairs.includes(pair)) {
            // everything deleted
            break;
          } else {
            this.delete_pair(pair[0], pair[1]);
            deleted_pairs.push(pair);

            // delete pairs in rotation r
            this.saveStep(14, {
              '%person%': pair[1].name,
              '%removee%': pair[0].name,
            });

            // update lines
            for (const person_inner of this.group1Agents.values()) {
              if (
                person_inner.ranking.length == 1 &&
                !finished_people.includes(person_inner.name)
              ) {
                // remove lines starting from person_inner
                this.currentLines = this.removePerson(
                  this.currentLines,
                  this.utils.getAsChar(person_inner),
                );

                // let person_inner propose to their last remaining person
                person_inner.lastProposed = person_inner.ranking.slice(0)[0];

                // remove lines going to their new proposal
                this.currentLines = this.removeTarget(
                  this.currentLines,
                  this.utils.getAsChar(person_inner.lastProposed),
                );
                // with lines are green early, without overlapping reds
                this.currentLines = this.removePerson(
                  this.currentLines,
                  this.utils.getAsChar(person_inner.lastProposed),
                );

                // update value in list
                this.stylePrefs(
                  'group1',
                  person_inner,
                  person_inner.ranking[0],
                  'green',
                );
                this.addLine(person_inner, person_inner.lastProposed, 'green');

                finished_people.push(person);
              }
            }
          }
        }

        // conditions to end if stable matching is found
        agents_multiple_prefs = this.check_pref_count();

        if (agents_multiple_prefs.size < 1) {
          break;
        }

        // if a person b has 1 perferance left
        this.saveStep(15);

        // update preferancees
        for (const person_inner of this.group1Agents.values()) {
          if (person_inner.ranking.length == 1) {
            person_inner.lastProposed = person_inner.ranking.slice(0)[0];

            // person b := last preferance
            this.saveStep(16, {
              '%person%': person_inner.name,
              '%preference%': person_inner.lastProposed.name,
            });
          }
        }

        // if any people have empty preferance lists - no mathcong
        this.saveStep(17, { '%person%': person.name });

        if (this.check_pref_list_empty() == true) {
          // end - no stable matching
          this.saveStep(18);
          // if stable == true then regenerate
          if (this.SRstable) {
            // console.log("ReRun")
            this.run(
              this.numberOfAgents,
              this.numberOfGroup2Agents,
              this.SRstable,
            );
          }

          return;
        }
        // needed to rest the for loop for the new values within the many_pref_list
        // this list is updated to remove people that no longer have many preferances
        break;
      }
    }

    // if PHASE 2 is not done - update viz
    if (agents_multiple_prefs.size == 0) {
      for (const person_inner of this.group1Agents.values()) {
        if (person_inner.ranking.length == 1) {
          // update value in list
          this.stylePrefs(
            'group1',
            person_inner,
            person_inner.ranking[0],
            'green',
          );

          this.currentLines = this.removePerson(
            this.currentLines,
            this.utils.getAsChar(person_inner),
          );

          this.currentLines = this.removeTarget(
            this.currentLines,
            this.utils.getAsChar(person_inner.lastProposed),
          );

          person_inner.lastProposed = person_inner.ranking.slice(0)[0];
          this.addLine(person_inner, person_inner.lastProposed, 'green');
        }
      }
    }

    this.saveStep(19);
    return;
  }
}
