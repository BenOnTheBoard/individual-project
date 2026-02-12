export interface Agent {
  name: string;
  match: Array<Agent>;
  ranking: Array<Agent>;
}

export interface Man extends Agent {
  lastProposed: number;
}

export interface Resident extends Agent {
  match: Array<Hospital>;
  ranking: Array<Hospital>;
}

export interface Hospital extends Agent {
  capacity: number;
  match: Array<Resident>;
  ranking: Array<Resident>;
}

export interface Student extends Agent {
  match: Array<Project>;
}

export interface Project extends Agent {
  capacity: number;
  match: Array<Student>;
}

export interface Lecturer extends Agent {
  capacity: number;
  ranking: Array<Student>;
  projects: Array<String>;
}

export interface Person extends Agent {
  match: Array<Person>;
  ranking: Array<Person>;
  lastProposed: Person;
}
