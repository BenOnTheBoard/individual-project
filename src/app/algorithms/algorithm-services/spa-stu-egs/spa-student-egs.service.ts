import { Injectable } from '@angular/core';
import { SPAS } from '../../abstract-classes/problem-definitions/SPAS';
import { AlgorithmData } from '../../interfaces/AlgorithmData';
import { Student, Project, Lecturer } from '../../interfaces/Agents';

@Injectable({
  providedIn: 'root',
})
export class SpaStudentEgsService extends SPAS {
  freeAgents: Array<Student> = [];
  // list of students that need to be matched and are available
  availableStudents() {
    const students = [];
    // for each student - if they are free and have people in their ranking - add to list and return
    for (const student of this.group1Agents.values()) {
      if (student.ranking.length > 0 && student.match.length == 0) {
        students.push(student);
      }
    }
    return students;
  }

  breakMatch(student: Student, project: Project) {
    // remove matching to project from student
    student.match.splice(0, 1);

    //remove matching to student from project
    const studentRank = project.match.indexOf(student);
    project.match.splice(studentRank, 1);

    this.removeLine(student, project, 'red');
    this.updateCapacityVisualization();
    this.updateFreeAgentList();
  }

  // dels successors of student from projects
  deletePairsFullProject(
    worstStudent: Student,
    project: Project,
    lecturer: Lecturer,
  ) {
    // loop though the lectures rakning in revese - remove the project from the ranking if each one
    // stop once we get to the student passed in - worstStudent
    this.saveStep(15, {
      '%student%': worstStudent.name,
      '%lecturer%': lecturer.name,
    });
    for (let i = lecturer.ranking.length - 1; i > -1; i--) {
      if (lecturer.ranking[i].name == worstStudent.name) {
        break;
      }

      // if S_i finds project p acceptable:
      this.saveStep(16, {
        '%student%': lecturer.ranking[i].name,
        '%project%': project.name,
      });
      if (lecturer.ranking[i].ranking.includes(project)) {
        const projectRank = this.getRank(lecturer.ranking[i], project);
        lecturer.ranking[i].ranking.splice(projectRank, 1);

        this.stylePrefs('group1', lecturer.ranking[i], project, 'grey');

        // remove p from S_i's preference list
        this.saveStep(17, {
          '%student%': lecturer.ranking[i].name,
          '%project%': project.name,
        });
      }
    }
  }

  deletePairsFullLecturer(worstStudent: Student, lecturer: Lecturer) {
    // loop through lecturer rankings backwards - stop when we reach worst student
    this.saveStep(20, {
      '%student%': worstStudent.name,
      '%lecturer%': lecturer.name,
    });
    for (let i = lecturer.ranking.length - 1; i > -1; i--) {
      const student = lecturer.ranking[i];
      if (student.name == worstStudent.name) {
        break;
      }

      // for each project offered by the lecture
      this.saveStep(21, { '%lecturer%': lecturer.name });
      for (const project of lecturer.projects) {
        // if the successor finds this project accesptable - remove the project from the ranking
        if (student.ranking.includes(project)) {
          const projectRank = this.getRank(student, project);
          student.ranking.splice(projectRank, 1);

          this.stylePrefs('group1', student, project, 'grey');

          // remove p from S_i's preference list
          this.saveStep(22, {
            '%student%': student.name,
            '%project%': project.name,
          });
        }
      }
    }
  }

  getHexByFullness(occupancy: number, capacity: number) {
    return this.colourHexService.getHex(
      occupancy == capacity ? 'green' : occupancy > capacity ? 'red' : 'black',
    );
  }

  updateCapacityVisualization() {
    let occupancy: number;
    let colour: string;

    for (const lecturer of this.group3Agents.values()) {
      occupancy = this.getLecturerOccupancy(lecturer);
      colour = this.getHexByFullness(occupancy, lecturer.capacity);
      this.algorithmSpecificData['lecturerCapacity'][
        Number(this.utils.getAsChar(lecturer))
      ] = `{${colour}${lecturer.capacity}}`;
    }

    for (const project of this.group2Agents.values()) {
      colour = this.getHexByFullness(project.match.length, project.capacity);
      this.hospitalCapacity.set(
        this.utils.getAsChar(project),
        `{${colour}${project.capacity}}`,
      );
    }
  }

  // update all the free agents each iteration
  updateFreeAgentList() {
    const freeAgentsList: Array<Student> = [];
    for (const student of this.group1Agents.values()) {
      if (student.match.length <= 0) {
        freeAgentsList.push(student);
      }
    }
    this.freeAgents = freeAgentsList;
    this.updateLecturerPrefs();
  }

  updateLecturerPrefs() {
    let colourHex = this.colourHexService.getHex('black');

    for (const lecturerRanking of this.algorithmSpecificData[
      'lecturerRanking'
    ]) {
      for (let i = 0; i < lecturerRanking.length; i++) {
        lecturerRanking[i] = `{${colourHex}${lecturerRanking[i].slice(-2)[0]}}`;
      }
    }

    colourHex = this.colourHexService.getHex('green');

    for (const student of this.group1Agents.values()) {
      if (student.match.length > 0) {
        const project = student.match[0];
        const lecturer = this.getProjectLecturer(project);

        const lecturerRank = Number(this.utils.getAsChar(lecturer)) - 1;
        const studentRank = this.group3Agents
          .get(lecturer.name)
          .ranking.indexOf(student);

        this.algorithmSpecificData['lecturerRanking'][lecturerRank][
          studentRank
        ] = `{${colourHex}${this.utils.getAsChar(student)}}`;
      }
    }
  }

  match(): AlgorithmData {
    this.saveStep(1);

    let availableStudents = this.availableStudents();
    // let stopPoint = 0

    // main loop check
    while (availableStudents.length > 0) {
      // get first student on list
      const student = availableStudents[0];
      // while some student s is free
      this.saveStep(2, { '%student%': student.name });

      // get students most prefered project and its lecturer
      const project = student.ranking[0];
      const lecturer = this.getProjectLecturer(project);

      // p = next most prefered project on s's list | l = lecturer who offers p
      this.saveStep(3, {
        '%student%': student.name,
        '%project%': project.name,
      });
      this.saveStep(4, { '%lecturer%': lecturer.name });

      // highlight assinged
      this.stylePrefs('group1', student, project, 'red');

      // provisionally assign student to project
      student.match.push(project);
      project.match.push(student);

      this.updateFreeAgentList();

      this.addLine(student, project, 'red');
      // provisionally assign s to p
      this.updateCapacityVisualization();
      this.saveStep(5, {
        '%student%': student.name,
        '%project%': project.name,
      });

      // if p is over-subscribed
      this.saveStep(6, { '%project%': project.name });

      // if project is over-subbed - remove worst student assigned to project
      if (project.match.length > project.capacity) {
        // worst student on this project, ranked by the projects lecturer
        const worstStudent = this.getWorstStudent(project);
        this.saveStep(7, {
          '%student%': worstStudent.name,
          '%project%': project.name,
        });
        this.breakMatch(worstStudent, project);
        this.saveStep(8, {
          '%student%': worstStudent.name,
          '%project%': project.name,
        });
      } else {
        // else if the lecturer is over-subbed - remove overall worst student
        this.saveStep(9, { '%lecturer%': lecturer.name });
        if (this.getLecturerOccupancy(lecturer) > lecturer.capacity) {
          // worst student assigned to the lecture
          const worstStudentLecturer = this.getWorstStudentLecturer(lecturer);
          const worstStudentProject = worstStudentLecturer.match[0];

          // Sw = worst student assigned to l | Pw = project that Sw is assigned to
          this.saveStep(10, {
            '%student%': worstStudentLecturer.name,
            '%lecturer%': lecturer.name,
          });
          this.saveStep(11, {
            '%student%': student.name,
            '%project%': worstStudentProject.name,
          });

          this.breakMatch(worstStudentLecturer, worstStudentProject);
          // break provisional assignment between Sw and Pw
          this.saveStep(12, {
            '%student%': worstStudentLecturer.name,
            '%project%': worstStudentProject.name,
          });
        }
      }

      // if the project is full - then delete successors
      this.saveStep(13, { '%project%': project.name });
      if (project.match.length == project.capacity) {
        // worst student on this project, ranked by the projects lecturer
        const worstStudent = this.getWorstStudent(project);
        this.saveStep(14, {
          '%student%': worstStudent.name,
          '%project%': project.name,
        });
        // for each successor st of sr on lecturer k's project - del pair (st, pj)
        this.deletePairsFullProject(worstStudent, project, lecturer);
      }

      // If the lecturer is at capacity
      this.saveStep(18, { '%lecturer%': lecturer.name });
      if (this.getLecturerOccupancy(lecturer) == lecturer.capacity) {
        // worst student ranked by the lecturer
        const worstStudentLecturer = this.getWorstStudentLecturer(lecturer);
        this.saveStep(19, {
          '%student%': worstStudentLecturer.name,
          '%lecturer%': lecturer.name,
        });

        // delete the project from worse students than ^
        this.deletePairsFullLecturer(worstStudentLecturer, lecturer);
      }

      availableStudents = this.availableStudents();

      // unhighlight assinged
      this.stylePrefs('group1', student, project, 'black');

      // update viz
      this.updateCapacityVisualization();
    }

    // updates confirms
    for (const student of this.group1Agents.values()) {
      // if the student has a matching - should
      if (student.match.length == 1) {
        this.stylePrefs('group1', student, student.match[0], 'green');
        this.changeLineColour(student, student.match[0], 'red', 'green');
      }
    }

    // END - Stable matching found
    this.saveStep(23);
    return;
  }
}
