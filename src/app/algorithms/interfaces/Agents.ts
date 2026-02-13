interface AbstractAgent<T> {
  name: string;
  match: Array<T>;
  ranking: Array<T>;
}

interface AbstracCapacitatedAgent<T> extends AbstractAgent<T> {
  capacity: number;
}

// We cast all the other agents to this one as a generic type
export type Agent = AbstractAgent<Agent>;

export type Woman = AbstractAgent<Man>;
export type Man = AbstractAgent<Woman> & {
  lastProposed: Woman;
};

export type Resident = AbstractAgent<Hospital>;
export type Hospital = AbstracCapacitatedAgent<Resident>;

export type Student = AbstractAgent<Project>;
export type Project = AbstracCapacitatedAgent<Student>;
export type Lecturer = AbstracCapacitatedAgent<Student> & {
  projects: Array<Project>;
};

export type Person = AbstractAgent<Person> & {
  lastProposed: Person;
};
