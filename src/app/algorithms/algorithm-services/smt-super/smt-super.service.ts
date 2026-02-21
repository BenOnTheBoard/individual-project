import { Injectable } from '@angular/core';
import { SMT } from '../../abstract-classes/problem-definitions/SMT';
import { AlgorithmData } from '../../interfaces/AlgorithmData';

@Injectable({
  providedIn: 'root',
})
export class SMTSuperService extends SMT {
  match(): AlgorithmData {
    throw new Error('not implemented yet');
  }
}
