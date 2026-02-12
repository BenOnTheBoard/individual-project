export interface Agent {
  name: string;
  match: Array<Agent>;
  ranking: Array<Agent>;
}

export interface Man extends Agent {
  lastProposed: number;
}

export interface Hospital extends Agent {
  capacity: number;
}

export interface Student extends Agent {
  match: Array<Project>;
}

export interface Project extends Hospital {
  match: Array<Student>;
}

export interface Lecturer extends Hospital {
  ranking: Array<Student>;
  projects: Array<String>;
}

export interface Person extends Agent {
  match: Array<Person>;
  ranking: Array<Person>;
  lastProposed: Person;
}
