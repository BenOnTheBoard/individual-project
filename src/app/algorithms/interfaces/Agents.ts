export type Group = 'group1' | 'group2';

interface AbstractAgent<T> {
  name: string;
  match: Array<T>;
}
interface UntiedAgent<T> extends AbstractAgent<T> {
  ranking: Array<T>;
}
interface UntiedCapAgent<T> extends UntiedAgent<T> {
  capacity: number;
}

// We cast the other agents to this one as a generic type
export type Agent = UntiedAgent<Agent>;

export type Woman = UntiedAgent<Man>;
export type Man = UntiedAgent<Woman> & {
  lastProposed: Woman;
};

export type Resident = UntiedAgent<Hospital>;
export type Hospital = UntiedCapAgent<Resident>;

export type Student = UntiedAgent<Project>;
export type Project = UntiedCapAgent<Student>;
export type Lecturer = UntiedCapAgent<Student> & {
  projects: Array<Project>;
};

export type Person = UntiedAgent<Person> & {
  lastProposed: Person;
};

// Ties
interface AbstractTiedAgent<T> extends AbstractAgent<T> {
  ranking: Array<Array<T>>;
}

// We cast the other agents to this one as a generic type
export type TiedAgent = AbstractTiedAgent<Agent>;

export type TiedWoman = AbstractTiedAgent<Man>;
export type TiedMan = AbstractTiedAgent<Woman>;

export class AgentFactory {
  static #createBaseAgent(name: string, extras?: Object): Object {
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

  //Ties
  static createTiedAgent(name: string): TiedAgent {
    return this.#createBaseAgent(name) as TiedAgent;
  }

  static createTiedWoman(name: string): TiedWoman {
    return this.#createBaseAgent(name) as TiedWoman;
  }

  static createTiedMan(name: string): TiedMan {
    return this.#createBaseAgent(name, { lastProposed: null }) as TiedMan;
  }
}
