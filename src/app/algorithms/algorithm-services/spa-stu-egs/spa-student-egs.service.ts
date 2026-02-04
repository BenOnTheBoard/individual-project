import { Injectable } from '@angular/core';
import { StudentProjectAllocation } from '../../abstract-classes/StudentProjectAllocation';
import { AlgorithmData } from '../../interfaces/AlgorithmData';
import { Lecturer } from '../../interfaces/Lecturer';
import { Project } from '../../interfaces/Project';
import { Student } from '../../interfaces/Student';

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

  hospitalCapacity: Map<string, number> = new Map();
  lecturerCapacitys: Map<String, number> = new Map();

  numberLectures: number;
  lecturerCapacity: number;

  constructor() {
    super();
  }

  generateAgents() {
    for (let i = 1; i < this.numberOfAgents + 1; i++) {
      let group1AgentName = this.group1Name + i;

      this.group1Agents.set(group1AgentName, {
        name: group1AgentName,
        match: new Array(),
        ranking: new Array(),
      });

      this.freeAgentsOfGroup1.push(group1AgentName);
    }

    let currentLetter = 'A';

    for (let i = 1; i < this.numberOfGroup2Agents + 1; i++) {
      let group2AgentName = this.group2Name + currentLetter;
      let projectCapacity = 2;

      this.group2Agents.set(group2AgentName, {
        name: group2AgentName,
        match: new Array(),
        ranking: new Array(),
        capacity: projectCapacity,
      });

      this.hospitalCapacity[currentLetter] = projectCapacity;

      currentLetter = String.fromCharCode(
        ((currentLetter.charCodeAt(0) + 1 - 65) % 26) + 65,
      );
    }

    // hospital capacity is placeholder name for project capacity - used so that it is displayed in canvas
    this.algorithmSpecificData['hospitalCapacity'] = this.hospitalCapacity;

    this.numberLectures = Math.ceil(this.numberOfGroup2Agents / 3);
    this.lecturerCapacity = Math.ceil(this.numberOfAgents / 3) + 1;

    // reset the group - if prevouis run had more projects/lecturers then they dont all get deleted - causes issues - index errors
    this.group3Agents = new Map();

    for (let i = 1; i < this.numberLectures + 1; i++) {
      let group3AgentName = this.group3Name + i;

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

  // USED FOR TESTING

  // check if no unmatched pair like each other more than their current partners - redone for SPA
  checkStability(allMatches: Map<String, Array<String>>): boolean {
    let stability = true;

    // for all students
    for (let student of this.group1Agents.values()) {
      let studentMatchIndex = 0;
      if (student.match.length == 0) {
        studentMatchIndex = student.ranking.length;
      } else {
        studentMatchIndex = this.originalGroup1CurrentPreferences
          .get(this.utils.getLastChar(student.name))
          .indexOf(this.utils.getLastChar(student.match[0].name));
      }

      // current student information
      let studentRanking = this.originalGroup1CurrentPreferences.get(
        this.utils.getLastChar(student.name),
      );

      for (let i = studentMatchIndex - 1; i >= 0; i--) {
        // get project + lecturer that is more preferred than the current
        let betterProjectname = studentRanking[i];
        let betterProject = this.group2Agents.get(
          this.group2Name + betterProjectname,
        );

        let betterProjectLecturer = this.getProjectLecturer(betterProject);

        // get lecturers ranking list to compare positions
        let lastMatchIndex = this.getLastMatchLecturer(betterProjectLecturer);

        let currentStudentIndex = this.getCurrentStudentIndex(
          student,
          betterProjectLecturer,
        );

        // IF bother under subbed (a)
        if (
          betterProject.match.length < betterProject.capacity &&
          this.getLecturerCurrentCapacity(betterProjectLecturer) <
            this.lecturerCapacity
        ) {
          stability = false;
        }

        // project is under subbed + lecturer is full + ()
        if (
          betterProject.match.length < betterProject.capacity &&
          this.getLecturerCurrentCapacity(betterProjectLecturer) ==
            this.lecturerCapacity
        ) {
          // if student is mathced to lecturer or student is preferred over worst matched student
          if (
            betterProjectLecturer.projects.includes(student.match[0].name) ||
            currentStudentIndex < lastMatchIndex
          ) {
            stability = false;
          }
        }

        // project is full + student is preferred over worst ranked person on project
        if (
          betterProject.match.length == betterProject.capacity &&
          currentStudentIndex < this.getLastMatchProject(betterProject)
        ) {
          stability = false;
        }

        if (currentStudentIndex < lastMatchIndex) {
          stability = false;
        }
      }
    }
    return stability;
  }

  // returns index of worst ranked studnet for a project according to the lecture within the lecturers preference list
  getLastMatchProject(project: Project) {
    let projectLecturer = this.getProjectLecturer(project);
    let worstIndex = 0;

    for (let student of project.match) {
      let index = projectLecturer.ranking.indexOf(student);

      if (index > worstIndex) {
        worstIndex = index;
      }
    }

    return worstIndex;
  }

  // returns the index of the least preferred match for a lecturer
  getLastMatchLecturer(lecturer: Lecturer) {
    let index = null;
    // for each student in ranking
    for (let i = 0; i < lecturer.ranking.length; i++) {
      // for each project that they host
      let student = lecturer.ranking[i];
      for (let p = 0; p < lecturer.projects.length; p++) {
        let projectName = lecturer.projects[p];
        let project = this.group2Agents.get(projectName);

        if (project.match.includes(student)) {
          index = i;
        }
      }

      return index;
    }
  }

  getCurrentStudentIndex(student: Student, lecturer: Lecturer) {
    return lecturer.ranking.indexOf(student);
  }

  // list of students that need to be matched and are available
  availableStudents() {
    let students = [];
    // for each student - if they are free and have people in their ranking - add to list and return
    for (let student of this.group1Agents.values()) {
      if (student.ranking.length > 0 && student.match.length == 0) {
        students.push(student);
      }
    }
    return students;
  }

  // returns the lecturer that runs the passed in project
  getProjectLecturer(project: Project) {
    for (let lecturer of this.group3Agents.values()) {
      if (lecturer.projects.includes(project.name)) {
        return lecturer;
      }
    }
    console.log("Can't find the lecturer that runs project -", project);
    return null;
  }

  // get the least prefered student assigned to a project according to the lecturer
  getWorstStudent(project: Project) {
    let lecturer = this.getProjectLecturer(project);

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
    let assignedStudents = [];

    // for each project the lecture runs
    for (let project of lecturer.projects) {
      let projectObject = this.group2Agents.get(project);

      // add the assigned students of the project to a list
      for (let student of projectObject.match) {
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
    let studentIndex = project.match.indexOf(student);
    project.match.splice(studentIndex, 1);

    this.removeArrayFromArray(this.currentLines, [
      this.utils.getLastChar(student.name),
      this.utils.getLastChar(project.name),
      'red',
    ]);
    this.updateCapacityVisualization();
    this.updateFreeList();
  }

  getLecturerCurrentCapacity(lecturer: Lecturer) {
    let currentCapacity = 0;
    // for each project the lecture runs
    for (let project of lecturer.projects) {
      let projectObject = this.group2Agents.get(project);

      // sum number of people assigned to the project
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
    this.update(15, {
      '%student%': worstStudent.name,
      '%lecturer%': lecturer.name,
    });
    for (let i = lecturer.ranking.length - 1; i > -1; i--) {
      if (lecturer.ranking[i].name == worstStudent.name) {
        break;
      }

      // if S_i finds project p acceptable:
      this.update(16, {
        '%student%': lecturer.ranking[i].name,
        '%project%': project.name,
      });
      if (lecturer.ranking[i].ranking.includes(project)) {
        let projectIndex = lecturer.ranking[i].ranking.indexOf(project);
        lecturer.ranking[i].ranking.splice(projectIndex, 1);

        this.changePreferenceStyle(
          this.group1CurrentPreferences,
          this.utils.getLastChar(lecturer.ranking[i].name),
          this.originalGroup1CurrentPreferences
            .get(this.utils.getLastChar(lecturer.ranking[i].name))
            .indexOf(this.utils.getLastChar(project.name)),
          'grey',
        );

        // remove p from S_i's preference list
        this.update(17, {
          '%student%': lecturer.ranking[i].name,
          '%project%': project.name,
        });
      }
    }
  }

  deleteFullPairsLecturer(worstStudent: Student, lecturer: Lecturer) {
    // loop through lecturer rankings backwards - stop when we reach worst student
    this.update(20, {
      '%student%': worstStudent.name,
      '%lecturer%': lecturer.name,
    });
    for (let i = lecturer.ranking.length - 1; i > -1; i--) {
      if (lecturer.ranking[i].name == worstStudent.name) {
        break;
      }

      // for each project offered by the lecture
      this.update(21, { '%lecturer%': lecturer.name });
      for (let project of lecturer.projects) {
        let projectObject = this.group2Agents.get(project);

        // if the successor finds this project accesptable - remove the project from the ranking
        if (lecturer.ranking[i].ranking.includes(projectObject)) {
          let projectIndex = lecturer.ranking[i].ranking.indexOf(projectObject);
          lecturer.ranking[i].ranking.splice(projectIndex, 1);

          this.changePreferenceStyle(
            this.group1CurrentPreferences,
            this.utils.getLastChar(lecturer.ranking[i].name),
            this.originalGroup1CurrentPreferences
              .get(this.utils.getLastChar(lecturer.ranking[i].name))
              .indexOf(this.utils.getLastChar(projectObject.name)),
            'grey',
          );

          // remove p from S_i's preference list
          this.update(22, {
            '%student%': lecturer.ranking[i].name,
            '%project%': projectObject.name,
          });
        }
      }
    }
  }

  updateCapacityVisualization() {
    let cap = 0;

    // lecturers
    for (let lecturer of this.group3Agents.values()) {
      cap = this.getLecturerCurrentCapacity(lecturer);
      if (cap == lecturer.capacity) {
        // turn green if at capacity
        this.algorithmSpecificData['lecturerCapacity'][
          Number(this.utils.getLastChar(lecturer.name))
        ] = '{#53D26F' + lecturer.capacity + '}';
      } else if (cap > lecturer.capacity) {
        // turn red if over capacity
        this.algorithmSpecificData['lecturerCapacity'][
          Number(this.utils.getLastChar(lecturer.name))
        ] = '{#EB2A2A' + lecturer.capacity + '}';
      } else {
        // turn black otherwise
        this.algorithmSpecificData['lecturerCapacity'][
          Number(this.utils.getLastChar(lecturer.name))
        ] = '{#000000' + lecturer.capacity + '}';
      }
    }

    //Projects
    for (let project of this.group2Agents.values()) {
      if (project.match.length == project.capacity) {
        // turn green to show full
        this.algorithmSpecificData['hospitalCapacity'][
          this.utils.getLastChar(project.name)
        ] = '{#53D26F' + project.capacity + '}';
      } else if (project.match.length > project.capacity) {
        // turn red to show over full
        this.algorithmSpecificData['hospitalCapacity'][
          this.utils.getLastChar(project.name)
        ] = '{#EB2A2A' + project.capacity + '}';
      } else {
        // turn black otherwise
        this.algorithmSpecificData['hospitalCapacity'][
          this.utils.getLastChar(project.name)
        ] = '{#000000' + project.capacity + '}';
      }
    }
  }

  // update all the free agents each iteration
  updateFreeList() {
    let freeAgentsList = [];
    for (let student of this.group1Agents.values()) {
      if (!(student.match.length > 0)) {
        freeAgentsList.push(student.name);
      }
    }
    this.freeAgentsOfGroup1 = freeAgentsList;
    this.updateLecturerPreferances();
  }

  updateLecturerPreferances() {
    // set all to black
    for (
      let i = 0;
      i < this.algorithmSpecificData['lecturerRanking'].length;
      i++
    ) {
      for (
        let j = 0;
        j < this.algorithmSpecificData['lecturerRanking'][i].length;
        j++
      ) {
        this.algorithmSpecificData['lecturerRanking'][i][j] =
          '{#000000' +
          this.algorithmSpecificData['lecturerRanking'][i][j].slice(-2)[0] +
          '}';
      }
    }

    // set matched to green
    for (let student of this.group1Agents.values()) {
      // if student has match
      if (student.match.length > 0) {
        let project = student.match[0];
        let lecturer = this.getProjectLecturer(project);

        let lectureIndex = Number(this.utils.getLastChar(lecturer.name)) - 1;
        let studentIndex = this.group3Agents
          .get(lecturer.name)
          .ranking.indexOf(student);

        this.algorithmSpecificData['lecturerRanking'][lectureIndex][
          studentIndex
        ] = '{#53D26F' + this.utils.getLastChar(student.name) + '}';
      }
    }
  }

  match(): AlgorithmData {
    let redLine = [];
    let greenLine = [];

    this.update(1);

    let availableStudents = this.availableStudents();
    // let stopPoint = 0

    // main loop check
    while (availableStudents.length > 0) {
      // get first student on list
      let student = availableStudents[0];
      // while some student s is free
      this.update(2, { '%student%': student.name });

      // get students most prefered project and its lecturer
      let preferedProject = student.ranking[0];
      let projectLecturer = this.getProjectLecturer(preferedProject);

      // p = next most prefered project on s's list | l = lecturer who offers p
      this.update(3, {
        '%student%': student.name,
        '%project%': preferedProject.name,
      });
      this.update(4, { '%lecturer%': projectLecturer.name });

      // highlight assinged
      this.changePreferenceStyle(
        this.group1CurrentPreferences,
        this.utils.getLastChar(student.name),
        this.originalGroup1CurrentPreferences
          .get(this.utils.getLastChar(student.name))
          .indexOf(this.utils.getLastChar(preferedProject.name)),
        'red',
      );

      // provisionally assign student to project
      student.match.push(preferedProject);
      preferedProject.match.push(student);

      this.updateFreeList();

      redLine = [
        this.utils.getLastChar(student.name),
        this.utils.getLastChar(preferedProject.name),
        'red',
      ];
      this.currentLines.push(redLine);
      // provisionally assign s to p
      this.updateCapacityVisualization();
      this.update(5, {
        '%student%': student.name,
        '%project%': preferedProject.name,
      });

      // if p is over-subscribed
      this.update(6, { '%project%': preferedProject.name });

      // if project is over-subbed - remove worst student assigned to project
      if (preferedProject.match.length > preferedProject.capacity) {
        // worst student on this project, ranked by the projects lecturer
        let worstStudent = this.getWorstStudent(preferedProject);
        this.update(7, {
          '%student%': worstStudent.name,
          '%project%': preferedProject.name,
        });
        this.breakMatch(worstStudent, preferedProject);
        this.update(8, {
          '%student%': worstStudent.name,
          '%project%': preferedProject.name,
        });
      } else {
        // else if the lecturer is over-subbed - remove overall worst student
        this.update(9, { '%lecturer%': projectLecturer.name });
        if (
          this.getLecturerCurrentCapacity(projectLecturer) >
          projectLecturer.capacity
        ) {
          // worst student assigned to the lecture
          let worstStudentOverall =
            this.getWorstStudentOverall(projectLecturer);
          let worstStudentProject = worstStudentOverall.match[0];

          // Sw = worst student assigned to l | Pw = project that Sw is assigned to
          this.update(10, {
            '%student%': worstStudentOverall.name,
            '%lecturer%': projectLecturer.name,
          });
          this.update(11, {
            '%student%': student.name,
            '%project%': worstStudentProject.name,
          });

          this.breakMatch(worstStudentOverall, worstStudentProject);
          // break provisional assignment between Sw and Pw
          this.update(12, {
            '%student%': worstStudentOverall.name,
            '%project%': worstStudentProject.name,
          });
        }
      }

      // if the project is full - then delete successors
      this.update(13, { '%project%': preferedProject.name });
      if (preferedProject.match.length == preferedProject.capacity) {
        // worst student on this project, ranked by the projects lecturer
        let worstStudent = this.getWorstStudent(preferedProject);
        this.update(14, {
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
      this.update(18, { '%lecturer%': projectLecturer.name });
      if (
        this.getLecturerCurrentCapacity(projectLecturer) ==
        projectLecturer.capacity
      ) {
        // worst student ranked by the lecturer
        let worstStudentOverall = this.getWorstStudentOverall(projectLecturer);
        this.update(19, {
          '%student%': worstStudentOverall.name,
          '%lecturer%': projectLecturer.name,
        });

        // delete the project from worse students than ^
        this.deleteFullPairsLecturer(worstStudentOverall, projectLecturer);
      }

      availableStudents = this.availableStudents();

      // unhighlight assinged
      this.changePreferenceStyle(
        this.group1CurrentPreferences,
        this.utils.getLastChar(student.name),
        this.originalGroup1CurrentPreferences
          .get(this.utils.getLastChar(student.name))
          .indexOf(this.utils.getLastChar(preferedProject.name)),
        'black',
      );

      // update viz
      this.updateCapacityVisualization();
    }

    // updates confirms
    for (let student of this.group1Agents.values()) {
      // if the student has a matching - should
      if (student.match.length == 1) {
        this.changePreferenceStyle(
          this.group1CurrentPreferences,
          this.utils.getLastChar(student.name),
          this.originalGroup1CurrentPreferences
            .get(this.utils.getLastChar(student.name))
            .indexOf(this.utils.getLastChar(student.match[0].name)),
          'green',
        );

        greenLine = [
          this.utils.getLastChar(student.name),
          this.utils.getLastChar(student.match[0].name),
          'green',
        ];
        this.currentLines.push(greenLine);
        this.removeArrayFromArray(this.currentLines, [
          this.utils.getLastChar(student.name),
          this.utils.getLastChar(student.match[0].name),
          'red',
        ]);
      }
    }

    // END - Stable matching found
    this.update(23);
    return;
  }
}
