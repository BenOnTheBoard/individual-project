interface AbstractAgent<T> {
  name: string;
  match: Array<T>;
  ranking: Array<T>;
}

interface AbstractCapacitatedAgent<T> extends AbstractAgent<T> {
  capacity: number;
}

// We cast all the other agents to this one as a generic type
export type Agent = AbstractAgent<Agent>;

export type Woman = AbstractAgent<Man>;
export type Man = AbstractAgent<Woman> & {
  lastProposed: Woman;
};

export type Resident = AbstractAgent<Hospital>;
export type Hospital = AbstractCapacitatedAgent<Resident>;

export type Student = AbstractAgent<Project>;
export type Project = AbstractCapacitatedAgent<Student>;
export type Lecturer = AbstractCapacitatedAgent<Student> & {
  projects: Array<Project>;
};

export type Person = AbstractAgent<Person> & {
  lastProposed: Person;
};

export class AgentFactory {
  static #createBaseAgent(name: string, extras?: Object): AbstractAgent<any> {
    return { name, match: [], ranking: [], ...extras };
  }

  static createAgent(name: string): Agent {
    return this.#createBaseAgent(name) as Agent;
  }

  static createWoman(name: string): Woman {
    return this.#createBaseAgent(name) as Woman;
  }

  static createMan(name: string): Man {
    return this.#createBaseAgent(name, { lastProposed: null }) as Man;
  }

  static createHospital(name: string, capacity: number): Hospital {
    return this.#createBaseAgent(name, { capacity }) as Hospital;
  }

  static createResident(name: string): Resident {
    return this.#createBaseAgent(name) as Resident;
  }

  static createStudent(name: string): Student {
    return this.#createBaseAgent(name) as Student;
  }

  static createProject(name: string, capacity: number): Project {
    return this.#createBaseAgent(name, { capacity }) as Project;
  }

  static createLecturer(name: string, capacity: number = 0): Lecturer {
    return this.#createBaseAgent(name, { capacity, projects: [] }) as Lecturer;
  }

  static createPerson(name: string): Person {
    return this.#createBaseAgent(name, { lastProposed: null }) as Person;
  }
}
