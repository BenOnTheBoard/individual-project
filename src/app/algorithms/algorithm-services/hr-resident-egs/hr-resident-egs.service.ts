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

  getNextProposee(resident: Resident): Hospital {
    // return first hospital on r's list
    return resident.ranking[0];
  }

  breakAssignment(resident: Resident, hospital: Hospital): void {
    this.assignmentBreakStyling(resident, hospital);
    super.breakAssignment(resident, hospital);
    this.freeAgents.push(resident);
  }

  removeRuledOutPrefs(resident: Resident, hospital: Hospital): void {
    this.saveStep(8, {
      '%resident%': resident.name,
      '%hospital%': hospital.name,
    });

    if (hospital.match.length < hospital.capacity) return;

    const worstResident = this.getWorstResident(hospital);
    const worstResidentRank = this.getRank(hospital, worstResident);

    this.saveStep(9, {
      '%hospital%': hospital.name,
      '%worstResident%': worstResident.name,
    });

    // for each successor h' of h on r's list {
    for (let i = worstResidentRank + 1; i < hospital.ranking.length; i++) {
      const resident = hospital.ranking[i];
      const hospitalRank = this.getRank(resident, hospital);
      this.relevantPrefs.push(this.utils.getAsChar(resident));

      this.saveStep(10, {
        '%hospital%': hospital.name,
        '%nextResident%': resident.name,
      });

      this.stylePrefsMutual(resident, hospital, 'grey');
      resident.ranking.splice(hospitalRank, 1);

      // remove h' and r from each other's lists
      this.saveStep(11, {
        '%hospital%': hospital.name,
        '%nextResident%': resident.name,
      });

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

      if (resident.ranking.length > 0 && !!this.getNextProposee(resident)) {
        this.saveStep(2, { '%currentAgent%': resident.name });

        const hospital = this.getNextProposee(resident);

        this.saveStep(3, {
          '%currentAgent%': resident.name,
          '%proposee%': hospital.name,
        });

        this.saveStep(4, {
          '%hospital%': hospital.name,
          '%capacity%': hospital.capacity,
          '%resident%': resident.name,
        });

        if (hospital.match.length >= hospital.capacity) {
          const worstResident = this.getWorstResident(hospital);

          this.saveStep(5, {
            '%hospital%': hospital.name,
            '%worstResident%': worstResident.name,
          });

          this.breakAssignment(worstResident, hospital);

          this.saveStep(6, {
            '%hospital%': hospital.name,
            '%worstResident%': resident.name,
          });
        }
        this.provisionallyAssign(resident, hospital);

        this.saveStep(7, {
          '%resident%': resident.name,
          '%hospital%': hospital.name,
        });

        this.removeRuledOutPrefs(resident, hospital);
      }
    }

    this.selectedAgents = [];
    this.relevantPrefs = [];
    this.saveStep(12);
    return;
  }
}
