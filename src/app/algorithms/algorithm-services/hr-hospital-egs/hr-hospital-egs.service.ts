import { Injectable } from '@angular/core';
import { Resident, Hospital } from '../../interfaces/Agents';
import { AlgorithmData } from '../../interfaces/AlgorithmData';
import { HR } from '../../abstract-classes/HR';

@Injectable({
  providedIn: 'root',
})
export class HrHospitalEgsService extends HR {
  freeHospitals: Array<Hospital> = new Array();

  #saveStepEight(resident: Resident, hospital: Hospital) {
    this.stylePrefsMutual(resident, hospital, 'grey');
    this.saveStep(8, this.packageStepVars(resident, hospital));
  }

  generateAgents(): void {
    super.generateAgents();
    for (const agent of this.group2Agents.values()) {
      this.freeHospitals.push(agent);
    }
  }

  getNextResident(hospital: Hospital): Resident | null {
    for (const resident of hospital.ranking) {
      if (resident.match[0] != hospital) return resident;
    }
    return null;
  }

  removeOutrankedHospitals(resident: Resident, hospital: Hospital): void {
    const hospitalRank = this.getRank(resident, hospital);

    if (hospitalRank + 1 < resident.ranking.length) {
      this.saveStep(7, this.packageStepVars(resident, hospital));

      for (let i = hospitalRank + 1; i < resident.ranking.length; i++) {
        const removedHospital = resident.ranking[i];
        const residentRank = this.getRank(removedHospital, resident);
        removedHospital.ranking.splice(residentRank, 1);
        resident.ranking.splice(i, 1);
        this.#saveStepEight(resident, removedHospital);
      }
    }
  }

  isFreeHospital(hospital: Hospital) {
    if (hospital.match.length >= hospital.capacity) return false;
    return !!this.getNextResident(hospital);
  }

  getFreeHospitals(): Array<Hospital> {
    return Array.from(this.group2Agents.values()).filter((hospital) =>
      this.isFreeHospital(hospital),
    );
  }

  match(): AlgorithmData {
    this.saveStep(1);

    while (this.freeHospitals.length > 0) {
      const hospital = this.freeHospitals[0];
      const resident = this.getNextResident(hospital);
      this.saveStep(2, this.packageStepVars(null, hospital));
      this.saveStep(3, this.packageStepVars(resident));
      this.saveStep(4, this.packageStepVars(resident));

      if (resident.match[0] != null) {
        this.breakAssignment(resident, resident.match[0]);
        this.saveStep(5, this.packageStepVars(resident, resident.match[0]));
      }

      this.provisionallyAssign(resident, hospital);
      this.provisionalAssignmentStyling(resident, hospital);
      this.saveStep(6, this.packageStepVars(resident, hospital));

      this.removeOutrankedHospitals(resident, hospital);
      this.freeHospitals = this.getFreeHospitals();
    }

    this.saveStep(9);
    return;
  }
}

// MAY PRODUCE UNSTABLE MATCHINGS DUE TO BLOCKING PAIRS - CHECKED BY WEBAPP
// OTHER ISSUES - SOME HOSPITALS/RESIDENTS ARE NOT MACTHED DUE To TAKEN BY OTHER HOSPITALS
// AND THEIR PREFERANCE LIST BEING EMPTYED BY PREVOUIS STEPS

// NEEDS RESEARCJ TO FIX - I THINK I PRODUCES
