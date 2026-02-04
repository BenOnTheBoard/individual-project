import { Agent } from './Agent';
import { Student } from './Student';

export interface Project extends Agent {
  match: Array<Student>;
  capacity: number;
}
