import { AlgorithmData } from '../interfaces/AlgorithmData';
import { MatchingAlgorithm } from './MatchingAlgorithm';
import { Student, Project, Lecturer } from '../interfaces/Agents';

export abstract class StudentProjectAllocation extends MatchingAlgorithm {
  group1Agents: Map<String, Student> = new Map();
  group2Agents: Map<String, Project> = new Map();
  group3Agents: Map<String, Lecturer> = new Map();

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

  abstract match(): AlgorithmData;
}
