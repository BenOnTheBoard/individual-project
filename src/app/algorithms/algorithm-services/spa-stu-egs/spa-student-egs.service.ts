import { Injectable } from '@angular/core';
import { StudentProjectAllocation } from '../../abstract-classes/StudentProjectAllocation';
import { AlgorithmData } from '../../interfaces/AlgorithmData';
import { Lecturer } from '../../interfaces/Lecturer';
import { Project } from '../../interfaces/Project';
import { Student } from '../../interfaces/Student';
import { Agent } from '../../interfaces/Agent';

const projectCapacity = 2;

@Injectable({
  providedIn: 'root',
})
export class SpaStudentEgsService extends StudentProjectAllocation {
  group1Name = 'student';
  group2Name = 'project';
  group3Name = 'lecturer';

  group1Agents: Map<String, Student> = new Map();
  group2Agents: Map<String, Project> = new Map();
  group3Agents: Map<String, Lecturer> = new Map();

  hospitalCapacity: Map<string, string> = new Map();
  lecturerCapacitys: Map<String, number> = new Map();

  numberLectures: number;
  lecturerCapacity: number;

  generateAgents() {
    for (let i = 1; i < this.numberOfAgents + 1; i++) {
      const group1AgentName = this.group1Name + i;
      const agent = {
        name: group1AgentName,
        match: new Array(),
        ranking: new Array(),
      };
      this.group1Agents.set(group1AgentName, agent);
      this.freeAgents.push(agent);
    }

    for (let i = 0; i < this.numberOfGroup2Agents; i++) {
      const currentLetter = String.fromCharCode(65 + i);
      const group2AgentName = this.group2Name + currentLetter;

      this.group2Agents.set(group2AgentName, {
        name: group2AgentName,
        match: new Array(),
        ranking: new Array(),
        capacity: projectCapacity,
      });

      this.hospitalCapacity[currentLetter] = projectCapacity;
    }

    // hospital capacity is placeholder name for project capacity - used so that it is displayed in canvas
    this.algorithmSpecificData['hospitalCapacity'] = this.hospitalCapacity;

    this.numberLectures = Math.ceil(this.numberOfGroup2Agents / 3);
    this.lecturerCapacity = Math.ceil(this.numberOfAgents / 3) + 1;

    // reset the group - if prevouis run had more projects/lecturers then they dont all get deleted - causes issues - rank errors
    this.group3Agents = new Map();

    for (let i = 1; i < this.numberLectures + 1; i++) {
      const group3AgentName = this.group3Name + i;

      this.group3Agents.set(group3AgentName, {
        name: group3AgentName,
        match: new Array(),
        ranking: new Array(),
        projects: new Array(),
        capacity: this.lecturerCapacity,
      });

      this.lecturerCapacitys[i] = this.lecturerCapacity;
    }
    this.algorithmSpecificData['lecturerCapacity'] = this.lecturerCapacitys;
  }

  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  checkStability(allMatches: Map<Agent, Array<String>>): boolean {
    for (const student of this.group1Agents.values()) {
      const studentMatchRank =
        student.match.length == 0
          ? student.ranking.length
          : this.getOriginalRank(student, student.match[0], 'group1');

      // current student information
      const studentRanking = this.originalPrefsGroup1.get(
        this.utils.getAsChar(student),
      );

      // loop over more preferable projects
      for (let i = studentMatchRank - 1; i >= 0; i--) {
        const betterProjectname = studentRanking[i];
        const betterProject = this.group2Agents.get(
          this.group2Name + betterProjectname,
        );
        const betterProjectLecturer = this.getProjectLecturer(betterProject);

        // get lecturers ranking list to compare positions
        const lastMatchRank = this.getLastMatchLecturer(betterProjectLecturer);
        const currentStudentRank = this.getRank(betterProjectLecturer, student);

        // pj undersubscribed,
        if (betterProject.match.length < betterProject.capacity) {
          // (a) lk undersubscribed
          if (
            this.getLecturerCurrentCapacity(betterProjectLecturer) <
            this.lecturerCapacity
          ) {
            return false;
          } else if (
            // (b) lk full, but si is in M(lk) better than the worst student in M(lk)
            this.getLecturerCurrentCapacity(betterProjectLecturer) ==
              this.lecturerCapacity &&
            (betterProjectLecturer.projects.includes(student.match[0].name) ||
              currentStudentRank < lastMatchRank)
          ) {
            return false;
          }
        }

        // (c) pj full, but si is better than the worst student in M(pj)
        if (
          betterProject.match.length == betterProject.capacity &&
          currentStudentRank < this.getLastMatchProject(betterProject)
        ) {
          return false;
        }
      }
    }
    return true;
  }

  // returns Rank of worst ranked studnet for a project according to the lecture within the lecturers preference list
  getLastMatchProject(project: Project) {
    const lecturer = this.getProjectLecturer(project);
    let worstRank = 0;

    for (const student of project.match) {
      const rank = this.getRank(lecturer, student);

      if (rank > worstRank) {
        worstRank = rank;
      }
    }

    return worstRank;
  }

  // returns the rank of the least preferred match for a lecturer
  getLastMatchLecturer(lecturer: Lecturer) {
    let rank = null;
    // for each student in ranking
    for (let i = 0; i < lecturer.ranking.length; i++) {
      // for each project that they host
      const student = lecturer.ranking[i];
      for (const projectName of lecturer.projects) {
        const project = this.group2Agents.get(projectName);

        if (project.match.includes(student)) {
          rank = i;
        }
      }

      return rank;
    }
  }

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

  // returns the lecturer that runs the passed in project
  getProjectLecturer(project: Project) {
    for (const lecturer of this.group3Agents.values()) {
      if (lecturer.projects.includes(project.name)) {
        return lecturer;
      }
    }
    return null;
  }

  // get the least prefered student assigned to a project according to the lecturer
  getWorstStudent(project: Project) {
    const lecturer = this.getProjectLecturer(project);

    // loop through ranking in reverse - first assigned student to appear is the worst
    for (let i = lecturer.ranking.length - 1; i > -1; i--) {
      if (project.match.includes(lecturer.ranking[i])) {
        return lecturer.ranking[i];
      }
    }

    return null;
  }

  // get the worst student given a lecture assigned to any of that lectures projects
  getWorstStudentOverall(lecturer: Lecturer) {
    const assignedStudents = [];

    // for each project the lecture runs
    for (const project of lecturer.projects) {
      const projectObject = this.group2Agents.get(project);

      // add the assigned students of the project to a list
      for (const student of projectObject.match) {
        assignedStudents.push(student);
      }
    }
    // loop through ranking in reverse - first assigned student to appear is the worst
    for (let i = lecturer.ranking.length - 1; i > -1; i--) {
      if (assignedStudents.includes(lecturer.ranking[i])) {
        return lecturer.ranking[i];
      }
    }

    return null;
  }

  breakMatch(student: Student, project: Project) {
    // remove matching to project from student
    student.match.splice(0, 1);

    //remove matching to student from project
    const studentRank = project.match.indexOf(student);
    project.match.splice(studentRank, 1);

    this.removeLine(student, project, 'red');
    this.updateCapacityVisualization();
    this.updateFreeList();
  }

  getLecturerCurrentCapacity(lecturer: Lecturer) {
    let currentCapacity = 0;
    for (const project of lecturer.projects) {
      const projectObject = this.group2Agents.get(project);
      currentCapacity += projectObject.match.length;
    }
    return currentCapacity;
  }

  // dels successors of student from projects
  deleteFullPairsProject(
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

  deleteFullPairsLecturer(worstStudent: Student, lecturer: Lecturer) {
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
        const projectObject = this.group2Agents.get(project);

        // if the successor finds this project accesptable - remove the project from the ranking
        if (student.ranking.includes(projectObject)) {
          const projectRank = this.getRank(student, projectObject);
          student.ranking.splice(projectRank, 1);

          this.stylePrefs('group1', student, projectObject, 'grey');

          // remove p from S_i's preference list
          this.saveStep(22, {
            '%student%': student.name,
            '%project%': projectObject.name,
          });
        }
      }
    }
  }

  getHexForFullness(occupancy: number, capacity: number) {
    return this.colourHexService.getHex(
      occupancy == capacity ? 'green' : occupancy > capacity ? 'red' : 'black',
    );
  }

  updateCapacityVisualization() {
    let occupancy: number;
    let colour: string;

    for (const lecturer of this.group3Agents.values()) {
      occupancy = this.getLecturerCurrentCapacity(lecturer);
      colour = this.getHexForFullness(occupancy, lecturer.capacity);
      this.algorithmSpecificData['lecturerCapacity'][
        Number(this.utils.getAsChar(lecturer))
      ] = `{${colour}${lecturer.capacity}}`;
    }

    for (const project of this.group2Agents.values()) {
      colour = this.getHexForFullness(project.match.length, project.capacity);
      this.hospitalCapacity.set(
        this.utils.getAsChar(project),
        `{${colour}${project.capacity}}`,
      );
    }
  }

  // update all the free agents each iteration
  updateFreeList() {
    const freeAgentsList: Array<Agent> = [];
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
      const preferedProject = student.ranking[0];
      const projectLecturer = this.getProjectLecturer(preferedProject);

      // p = next most prefered project on s's list | l = lecturer who offers p
      this.saveStep(3, {
        '%student%': student.name,
        '%project%': preferedProject.name,
      });
      this.saveStep(4, { '%lecturer%': projectLecturer.name });

      // highlight assinged
      this.stylePrefs('group1', student, preferedProject, 'red');

      // provisionally assign student to project
      student.match.push(preferedProject);
      preferedProject.match.push(student);

      this.updateFreeList();

      this.addLine(student, preferedProject, 'red');
      // provisionally assign s to p
      this.updateCapacityVisualization();
      this.saveStep(5, {
        '%student%': student.name,
        '%project%': preferedProject.name,
      });

      // if p is over-subscribed
      this.saveStep(6, { '%project%': preferedProject.name });

      // if project is over-subbed - remove worst student assigned to project
      if (preferedProject.match.length > preferedProject.capacity) {
        // worst student on this project, ranked by the projects lecturer
        const worstStudent = this.getWorstStudent(preferedProject);
        this.saveStep(7, {
          '%student%': worstStudent.name,
          '%project%': preferedProject.name,
        });
        this.breakMatch(worstStudent, preferedProject);
        this.saveStep(8, {
          '%student%': worstStudent.name,
          '%project%': preferedProject.name,
        });
      } else {
        // else if the lecturer is over-subbed - remove overall worst student
        this.saveStep(9, { '%lecturer%': projectLecturer.name });
        if (
          this.getLecturerCurrentCapacity(projectLecturer) >
          projectLecturer.capacity
        ) {
          // worst student assigned to the lecture
          const worstStudentOverall =
            this.getWorstStudentOverall(projectLecturer);
          const worstStudentProject = worstStudentOverall.match[0];

          // Sw = worst student assigned to l | Pw = project that Sw is assigned to
          this.saveStep(10, {
            '%student%': worstStudentOverall.name,
            '%lecturer%': projectLecturer.name,
          });
          this.saveStep(11, {
            '%student%': student.name,
            '%project%': worstStudentProject.name,
          });

          this.breakMatch(worstStudentOverall, worstStudentProject);
          // break provisional assignment between Sw and Pw
          this.saveStep(12, {
            '%student%': worstStudentOverall.name,
            '%project%': worstStudentProject.name,
          });
        }
      }

      // if the project is full - then delete successors
      this.saveStep(13, { '%project%': preferedProject.name });
      if (preferedProject.match.length == preferedProject.capacity) {
        // worst student on this project, ranked by the projects lecturer
        const worstStudent = this.getWorstStudent(preferedProject);
        this.saveStep(14, {
          '%student%': worstStudent.name,
          '%project%': preferedProject.name,
        });
        // for each successor st of sr on lecturer k's project - del pair (st, pj)
        this.deleteFullPairsProject(
          worstStudent,
          preferedProject,
          projectLecturer,
        );
      }

      // If the lecturer is at capacity
      this.saveStep(18, { '%lecturer%': projectLecturer.name });
      if (
        this.getLecturerCurrentCapacity(projectLecturer) ==
        projectLecturer.capacity
      ) {
        // worst student ranked by the lecturer
        const worstStudentOverall =
          this.getWorstStudentOverall(projectLecturer);
        this.saveStep(19, {
          '%student%': worstStudentOverall.name,
          '%lecturer%': projectLecturer.name,
        });

        // delete the project from worse students than ^
        this.deleteFullPairsLecturer(worstStudentOverall, projectLecturer);
      }

      availableStudents = this.availableStudents();

      // unhighlight assinged
      this.stylePrefs('group1', student, preferedProject, 'black');

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
