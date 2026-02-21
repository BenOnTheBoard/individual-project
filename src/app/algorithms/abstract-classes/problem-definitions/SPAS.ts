import { AlgorithmData } from '../../interfaces/AlgorithmData';
import {
  Student,
  Project,
  Lecturer,
  AgentFactory,
} from '../../interfaces/Agents';
import { UntiedMatchingAlgorithm } from '../UntiedMatchingAlgorithm';

export abstract class SPAS extends UntiedMatchingAlgorithm {
  group1Name = 'student';
  group2Name = 'project';
  group3Name = 'lecturer';

  group1Agents: Map<String, Student> = new Map();
  group2Agents: Map<String, Project> = new Map();
  group3Agents: Map<String, Lecturer> = new Map();

  hospitalCapacity: Map<string, string> = new Map();
  lecturerCapacities: Map<number, number> = new Map();
  projectCap = 2;
  numLecturers: number;

  generateAgents(): void {
    for (let i = 1; i < this.numberOfAgents + 1; i++) {
      const name = this.group1Name + i;
      const agent = AgentFactory.createStudent(name);
      this.group1Agents.set(name, agent);
      this.freeAgents.push(agent);
    }

    for (let i = 0; i < this.numberOfGroup2Agents; i++) {
      const letter = String.fromCharCode(65 + i);
      const name = this.group2Name + letter;
      const agent = AgentFactory.createProject(name, this.projectCap);
      this.group2Agents.set(name, agent);
      this.hospitalCapacity.set(letter, String(this.projectCap));
    }

    // hospital capacity is placeholder name for project capacity - used so that it is displayed in canvas
    this.algorithmSpecificData['hospitalCapacity'] = this.hospitalCapacity;

    this.numLecturers = Math.ceil(this.numberOfGroup2Agents / 3);
    const lecturerCapacity = Math.ceil(this.numberOfAgents / 3) + 1;

    // reset the group - if prevouis run had more projects/lecturers then they dont all get deleted - causes issues - rank errors
    this.group3Agents = new Map();

    for (let i = 1; i < this.numLecturers + 1; i++) {
      const name = this.group3Name + i;
      const agent = AgentFactory.createLecturer(name, lecturerCapacity);
      this.group3Agents.set(name, agent);
      this.lecturerCapacities.set(i, lecturerCapacity);
    }
    this.algorithmSpecificData['lecturerCapacity'] = this.lecturerCapacities;
  }

  generatePrefs(): void {
    const numLecturers = Math.ceil(this.numberOfGroup2Agents / 3);
    const projectLists: Array<Array<Project>> = [];

    // Students - Group 1
    for (const student of Array.from(this.group1Agents.values())) {
      const agent1Rankings = Array.from(new Map(this.group2Agents).values());
      this.utils.shuffle(agent1Rankings);
      this.group1Agents.get(student.name).ranking = agent1Rankings;
    }

    for (let i = 0; i < numLecturers; i++) {
      projectLists.push([]);
    }

    // Projects - Group 2
    let count = 1;
    for (const project of Array.from(this.group2Agents.values())) {
      const listIndex = Math.ceil(count / 3) - 1;
      projectLists[listIndex].push(project);
      count++;
    }

    // Lecturers - Group 3
    this.algorithmSpecificData['lecturerRanking'] = [];
    count = 0;
    let lecturerRanking: Array<string>;
    for (const lecturer of Array.from(this.group3Agents.values())) {
      const agent3Rankings = Array.from(new Map(this.group1Agents).values());
      this.utils.shuffle(agent3Rankings);
      this.group3Agents.get(lecturer.name).ranking = agent3Rankings;

      lecturer.projects = projectLists[count];

      // add lecture ranking to algorithmspecData for use in canvas display
      lecturerRanking = [];
      for (const student of agent3Rankings) {
        lecturerRanking.push(this.utils.getAsChar(student));
      }
      this.algorithmSpecificData['lecturerRanking'].push(lecturerRanking);
      count++;
    }
    this.algorithmSpecificData['lecturerProjects'] = projectLists;
  }
  // returns the lecturer that runs the passed in project
  getProjectLecturer(project: Project) {
    for (const lecturer of this.group3Agents.values()) {
      if (lecturer.projects.includes(project)) {
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
  getWorstStudentLecturer(lecturer: Lecturer) {
    const assignedStudents = [];

    // for each project the lecture runs
    for (const project of lecturer.projects) {
      // add the assigned students of the project to a list
      for (const student of project.match) {
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
      for (const project of lecturer.projects) {
        if (project.match.includes(student)) {
          rank = i;
        }
      }

      return rank;
    }
  }

  getLecturerOccupancy(lecturer: Lecturer) {
    let occupancy = 0;
    for (const project of lecturer.projects) {
      occupancy += project.match.length;
    }
    return occupancy;
  }

  isBlockingPair(student: Student, project: Project): boolean {
    const lecturer = this.getProjectLecturer(project);
    const lastMatchRank = this.getLastMatchLecturer(lecturer);
    const currentStudentRank = this.getRank(lecturer, student);

    // pj undersubscribed,
    if (project.match.length < project.capacity) {
      // (a) lk undersubscribed
      if (this.getLecturerOccupancy(lecturer) < lecturer.capacity) {
        return true;
      } else if (
        // (b) lk full, but si is in M(lk) better than the worst student in M(lk)
        this.getLecturerOccupancy(lecturer) == lecturer.capacity &&
        (lecturer.projects.includes(student.match[0]) ||
          currentStudentRank < lastMatchRank)
      ) {
        return true;
      }
    }
    // (c) pj full, but si is better than the worst student in M(pj)
    if (
      project.match.length == project.capacity &&
      currentStudentRank < this.getLastMatchProject(project)
    ) {
      return true;
    }
    return false;
  }

  checkStability(): boolean {
    for (const student of this.group1Agents.values()) {
      const studentMatchRank =
        student.match.length == 0
          ? student.ranking.length
          : this.getOriginalRank(student, student.match[0], 'group1');
      const studentRanking = this.origPrefsGroup1.get(student.name);
      // loop over more preferable projects
      for (let i = studentMatchRank - 1; i >= 0; i--) {
        const project = this.group2Agents.get(studentRanking[i]);
        if (this.isBlockingPair(student, project)) return false;
      }
    }
    return true;
  }

  abstract match(): AlgorithmData;
}
