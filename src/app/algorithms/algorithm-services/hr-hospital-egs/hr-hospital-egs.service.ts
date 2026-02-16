import { Injectable } from '@angular/core';
import { Resident, Hospital } from '../../interfaces/Agents';
import { AlgorithmData } from '../../interfaces/AlgorithmData';
import { HR } from '../../abstract-classes/HR';

@Injectable({
  providedIn: 'root',
})
export class HrHospitalEgsService extends HR {
  freeHospitals: Array<Hospital> = new Array();

  generateAgents(): void {
    super.generateAgents();
    for (const agent of this.group2Agents.values()) {
      this.freeHospitals.push(agent);
    }
  }

  getNextProposee(hospital: Hospital): Resident | null {
    for (const proposee of hospital.ranking) {
      if (proposee.match[0] != hospital) return proposee;
    }
    return null;
  }

  breakAssignment(resident: Resident, hospital: Hospital): void {
    this.assignmentBreakStyling(resident, hospital);
    this.saveStep(5, {
      '%hospital%': resident.match[0].name, // old hospital
      '%resident%': resident.name,
    });
    super.breakAssignment(resident, hospital);
  }

  removeRuledOutPrefs(resident: Resident, hospital: Hospital): void {
    // given h and r - remove h' of h on r's list
    const hospitalRank = this.getRank(resident, hospital);

    if (hospitalRank + 1 < resident.ranking.length) {
      // for each successor h' of h on r's list
      this.saveStep(7, {
        '%resident%': resident.name,
        '%hospital%': hospital.name,
      });

      for (let i = hospitalRank + 1; i < resident.ranking.length; i++) {
        const removedHospital = resident.ranking[i];
        const residentRank = this.getRank(removedHospital, resident);

        removedHospital.ranking.splice(residentRank, 1);

        // remove hospital from resident
        resident.ranking.splice(i, 1);
        this.stylePrefsMutual(resident, removedHospital, 'grey');
        // remove h' and r from each others preferance list
        this.saveStep(8, {
          '%hospital%': removedHospital.name,
          '%resident%': resident.name,
        });
      }
    }
  }

  // returns true if there is a resident on the list that is not matched with that hospital
  checkHospitalPrefList(hospital: Hospital) {
    for (const resident of hospital.ranking) {
      // if they are not matched to the hospital
      if (resident.match[0] != hospital) return true;
    }
    return false;
  }

  // returns all the hospitals that should be looked at
  // they are undersubbed and there is someone not assigned to them that the hospital wants
  getFreeHospitals(): Array<Hospital> {
    const freeHospitals: Array<Hospital> = [];
    for (const hospital of this.group2Agents.values()) {
      const hospitalCap = hospital.capacity;

      // if hospital in undersubbed and there is someone on the list that is not assigned to them
      if (
        hospital.match.length < hospitalCap &&
        this.checkHospitalPrefList(hospital)
      ) {
        freeHospitals.push(hospital);
      }
    }

    return freeHospitals;
  }

  match(): AlgorithmData {
    // "Set each hospital and resident to be completely free",
    this.saveStep(1);

    // while a HOSPITAL h is under-subscribed and
    // h's list contains a a RESIDENT r not assigned to h
    while (this.freeHospitals.length > 0) {
      // get first hospital on list
      const currentHospital = this.freeHospitals[0];

      // "While some hospital h is - undersubscibed,
      // and has a resident r on h's preferance list that is no assigned to h",
      this.saveStep(2, { '%hospital%': currentHospital.name });

      if (
        currentHospital.ranking.length <= 0 ||
        !this.getNextProposee(currentHospital)
      ) {
        this.freeHospitals.shift();
      } else {
        const proposee = this.getNextProposee(currentHospital);

        // a RESIDENT r that is not assigned to h, but is on its pref list
        // "r := first resident on h's prefernace list not assigned to h",
        this.saveStep(3, { '%resident%': proposee.name });

        // if proposee is assigned to a different hospital then un assign
        // if r is assigned to another hospital h
        this.saveStep(4, { '%resident%': proposee.name });

        if (proposee.match[0] != null) {
          this.breakAssignment(proposee, proposee.match[0]);
        }

        // provisionally assign r to h
        this.provisionallyAssign(proposee, currentHospital);
        this.saveStep(6, {
          '%resident%': proposee.name,
          '%hospital%': currentHospital.name,
        });

        this.removeRuledOutPrefs(proposee, currentHospital);

        this.freeHospitals = this.getFreeHospitals();
      }
    }

    // stable matching found
    this.saveStep(9);
    return;
  }
}

// MAY PRODUCE UNSTABLE MATCHINGS DUE TO BLOCKING PAIRS - CHECKED BY WEBAPP
// OTHER ISSUES - SOME HOSPITALS/RESIDENTS ARE NOT MACTHED DUE To TAKEN BY OTHER HOSPITALS
// AND THEIR PREFERANCE LIST BEING EMPTYED BY PREVOUIS STEPS

// NEEDS RESEARCJ TO FIX - I THINK I PRODUCES
