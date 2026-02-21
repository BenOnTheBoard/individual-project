export type Group = 'group1' | 'group2';

export interface Agent<T> {
  name: string;
  match: Array<T>;
}
interface AbstractUntiedAgent<T> extends Agent<T> {
  ranking: Array<T>;
}
interface UntiedCapAgent<T> extends AbstractUntiedAgent<T> {
  capacity: number;
}

// We cast the other agents to this one as a generic type
export type UntiedAgent = AbstractUntiedAgent<UntiedAgent>;

export type Woman = AbstractUntiedAgent<Man>;
export type Man = AbstractUntiedAgent<Woman> & {
  lastProposed: Woman;
};

export type Resident = AbstractUntiedAgent<Hospital>;
export type Hospital = UntiedCapAgent<Resident>;

export type Student = AbstractUntiedAgent<Project>;
export type Project = UntiedCapAgent<Student>;
export type Lecturer = UntiedCapAgent<Student> & {
  projects: Array<Project>;
};

export type Person = AbstractUntiedAgent<Person> & {
  lastProposed: Person;
};

// Ties
interface AbstractTiedAgent<T> extends Agent<T> {
  ranking: Array<Array<T>>;
}

// We cast the other agents to this one as a generic type
export type TiedAgent = AbstractTiedAgent<TiedAgent>;

export type TiedWoman = AbstractTiedAgent<Man>;
export type TiedMan = AbstractTiedAgent<Woman>;

export class AgentFactory {
  static #createBaseAgent(name: string, extras?: Object): Object {
    return { name, match: [], ranking: [], ...extras };
  }

  static createUntiedAgent(name: string): UntiedAgent {
    return this.#createBaseAgent(name) as UntiedAgent;
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
