import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Position } from './position';
import { Agent } from '../algorithms/interfaces/Agents';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  checkArrayEquality(a: Array<string>, b: Array<string>) {
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }

  // FROM: https://javascript.info/task/shuffle
  shuffle(array: Array<Object>) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  selectRandomElement<T>(arr: Array<T>): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  argMax<T>(items: Array<T>, score: (x: T) => number): T {
    if (items.length === 0) throw Error('empty list in argMax');
    return items.reduce((best, current) =>
      score(current) > score(best) ? current : best,
    );
  }

  randInt(lb: number, ub: number): number {
    return Math.floor(Math.random() * (ub - lb) + lb);
  }

  getRandomAgentCounts(equalGroups: boolean): [number, number] {
    const numG1Agent = this.randInt(2, 9);
    if (equalGroups) return [numG1Agent, numG1Agent];
    const numG2Agent = this.randInt(2, numG1Agent);
    return [numG1Agent, numG2Agent];
  }

  cloneList<T>(list: Array<T>): Array<T> {
    return [...list];
  }

  getLastChar(name: string): string {
    return name.slice(name.length - 1);
  }

  getAsChar(agent: Agent<any>): string {
    return this.getLastChar(agent.name);
  }

  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  polarToCartesian(
    r: number,
    theta: number,
    origin: Position = { x: 0, y: 0 },
  ): Position {
    return {
      x: origin.x + r * Math.cos(theta),
      y: origin.y + r * Math.sin(theta),
    };
  }

  static validateEven(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const { value } = control;
      if (value == null || value % 2 === 0) return null;
      return { even: { value: control.value, requiredEven: true } };
    };
  }
}
