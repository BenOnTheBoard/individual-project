import { AlgorithmData } from '../interfaces/AlgorithmData';
import { MatchingAlgorithm } from './MatchingAlgorithm';
import { Agent } from '../interfaces/Agent';
import { Student } from '../interfaces/Student';
import { Project } from '../interfaces/Project';
import { Lecturer } from '../interfaces/Lecturer';

export abstract class StudentProjectAllocation extends MatchingAlgorithm {
  group1Agents: Map<String, Student> = new Map();
  group2Agents: Map<String, Project> = new Map();
  group3Agents: Map<String, Lecturer> = new Map();

  constructor() {
    super();
  }

  generatePreferences(): void {
    let numberLectures = 0;
    let projectLists = [];

    // Students - Group 1
    for (let student of Array.from(this.group1Agents.values())) {
      let agent1Rankings = Array.from(new Map(this.group2Agents).values());
      this.shuffle(agent1Rankings);
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
    for (let project of Array.from(this.group2Agents.values())) {
      let listIndex = Math.ceil(count / 3) - 1;
      projectLists[listIndex].push(project.name);
      count++;
    }

    // Lectures - Group 3
    this.algorithmSpecificData['lecturerRanking'] = [];
    count = 0;
    let lecturerRanking = [];
    for (let lecturer of Array.from(this.group3Agents.values())) {
      let agent3Rankings = Array.from(new Map(this.group1Agents).values());
      this.shuffle(agent3Rankings);
      this.group3Agents.get(lecturer.name).ranking = agent3Rankings;

      lecturer.projects = projectLists[count];

      // add lecture ranking to algorithmspecData for use in canvas display
      lecturerRanking = [];
      for (let student of agent3Rankings) {
        lecturerRanking.push(this.getLastCharacter(student.name));
      }
      this.algorithmSpecificData['lecturerRanking'].push(lecturerRanking);
      count++;
    }
    this.algorithmSpecificData['lecturerProjects'] = projectLists;
  }

  populatePreferences(preferences: Map<String, Array<String>>): void {
    this.generatePreferences();

    let tempCopyList: Agent[];

    for (let agent of Array.from(this.group1Agents.keys())) {
      tempCopyList = [];
      for (let preferenceAgent of preferences.get(
        this.getLastCharacter(String(agent))
      )) {
        tempCopyList.push(
          this.group2Agents.get(this.group2Name + preferenceAgent)
        );
      }
      this.group1Agents.get(agent).ranking = tempCopyList;
    }
  }

  printRanking(group) {
    for (let agent of group.values()) {
      let names = [];
      if (agent.ranking) {
        for (let agentInner of agent.ranking) {
          names.push(agentInner.name);
        }
      }
    }
  }

  abstract match(): AlgorithmData;
}
