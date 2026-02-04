import { AlgorithmData } from '../interfaces/AlgorithmData';
import { MatchingAlgorithm } from './MatchingAlgorithm';
import { Agent } from '../interfaces/Agent';
import { Student } from '../interfaces/Student';
import { Project } from '../interfaces/Project';
import { Lecturer } from '../interfaces/Lecturer';
import { UtilsService } from 'src/app/utils/utils.service';

export abstract class StudentProjectAllocation extends MatchingAlgorithm {
  group1Agents: Map<String, Student> = new Map();
  group2Agents: Map<String, Project> = new Map();
  group3Agents: Map<String, Lecturer> = new Map();

  constructor(public utils: UtilsService) {
    super(utils);
  }

  generatePreferences(): void {
    let numberLectures = 0;
    let projectLists = [];

    // Students - Group 1
    for (const student of Array.from(this.group1Agents.values())) {
      const agent1Rankings = Array.from(new Map(this.group2Agents).values());
      this.utils.shuffle(agent1Rankings);
      this.group1Agents.get(student.name).ranking = agent1Rankings;
    }

    // make lists that show each project that a lecturer runs
    numberLectures = Math.ceil(this.numberOfGroup2Agents / 3);
    projectLists = [];
    for (let i = 0; i < numberLectures; i++) {
      projectLists.push([]);
    }

    // Projects - Group 2
    let count = 1;
    for (const project of Array.from(this.group2Agents.values())) {
      const listIndex = Math.ceil(count / 3) - 1;
      projectLists[listIndex].push(project.name);
      count++;
    }

    // Lectures - Group 3
    this.algorithmSpecificData['lecturerRanking'] = [];
    count = 0;
    let lecturerRanking = [];
    for (const lecturer of Array.from(this.group3Agents.values())) {
      const agent3Rankings = Array.from(new Map(this.group1Agents).values());
      this.utils.shuffle(agent3Rankings);
      this.group3Agents.get(lecturer.name).ranking = agent3Rankings;

      lecturer.projects = projectLists[count];

      // add lecture ranking to algorithmspecData for use in canvas display
      lecturerRanking = [];
      for (const student of agent3Rankings) {
        lecturerRanking.push(this.utils.getLastChar(student.name));
      }
      this.algorithmSpecificData['lecturerRanking'].push(lecturerRanking);
      count++;
    }
    this.algorithmSpecificData['lecturerProjects'] = projectLists;
  }

  populatePreferences(preferences: Map<String, Array<String>>): void {
    this.generatePreferences();

    let tempCopyList: Array<Agent>;

    for (const agent of Array.from(this.group1Agents.keys())) {
      tempCopyList = [];
      for (const preferenceAgent of preferences.get(
        this.utils.getLastChar(String(agent)),
      )) {
        tempCopyList.push(
          this.group2Agents.get(this.group2Name + preferenceAgent),
        );
      }
      this.group1Agents.get(agent).ranking = tempCopyList;
    }
  }

  printRanking(group) {
    for (const agent of group.values()) {
      const names = [];
      if (agent.ranking) {
        for (const agentInner of agent.ranking) {
          names.push(agentInner.name);
        }
      }
    }
  }

  abstract match(): AlgorithmData;
}
