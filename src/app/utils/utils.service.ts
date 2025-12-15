import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

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

  static validateEven(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value % 2 === 0) {
        return null;
      }
      return { even: { value: control.value, requiredEven: true } };
    };
  }
}
