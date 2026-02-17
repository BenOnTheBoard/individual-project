import { Injectable } from '@angular/core';
import { Resident, Hospital } from '../../interfaces/Agents';
import { AlgorithmData } from '../../interfaces/AlgorithmData';
import { HR } from '../../abstract-classes/HR';

@Injectable({
  providedIn: 'root',
})
export class HrResidentEgsService extends HR {
  freeAgents: Array<Resident>;

  generateAgents(): void {
    super.generateAgents();
    for (const agent of this.group1Agents.values()) {
      this.freeAgents.push(agent);
    }
  }

  getNextHospital(resident: Resident): Hospital {
    return resident.ranking[0];
  }

  removeRuledOutPrefs(resident: Resident, hospital: Hospital): void {
    this.saveStep(8, this.packageStepVars(resident, hospital));

    if (hospital.match.length < hospital.capacity) return;

    const worstResident = this.getWorstResident(hospital);
    const worstResidentRank = this.getRank(hospital, worstResident);

    this.saveStep(9, this.packageStepVars(worstResident, hospital));

    // for each successor h' of h on r's list {
    for (let i = worstResidentRank + 1; i < hospital.ranking.length; i++) {
      const resident = hospital.ranking[i];
      const hospitalRank = this.getRank(resident, hospital);
      this.relevantPrefs.push(this.utils.getAsChar(resident));

      this.saveStep(10, this.packageStepVars(resident, hospital));

      this.stylePrefsMutual(resident, hospital, 'grey');
      resident.ranking.splice(hospitalRank, 1);

      // remove h' and r from each other's lists
      this.saveStep(11, this.packageStepVars(resident, hospital));

      hospital.ranking.splice(i, 1);
      i--;

      this.relevantPrefs.pop();
    }
  }

  match(): AlgorithmData {
    this.saveStep(1);

    while (this.freeAgents.length > 0) {
      const resident = this.freeAgents[0];
      this.freeAgents.shift();

      if (resident.ranking.length > 0 && !!this.getNextHospital(resident)) {
        this.saveStep(2, this.packageStepVars(resident));

        const hospital = this.getNextHospital(resident);
        this.saveStep(3, this.packageStepVars(resident, hospital));
        this.saveStep(4, this.packageStepVars(resident, hospital));

        if (hospital.match.length >= hospital.capacity) {
          const worstResident = this.getWorstResident(hospital);
          this.saveStep(5, this.packageStepVars(worstResident, hospital));
          this.breakAssignment(worstResident, hospital);
          this.freeAgents.push(resident);
          this.saveStep(6, this.packageStepVars(resident, hospital));
        }

        this.provisionallyAssign(resident, hospital);
        this.saveStep(7, this.packageStepVars(resident, hospital));

        this.removeRuledOutPrefs(resident, hospital);
      }
    }

    this.saveStep(12);
    return;
  }
}
