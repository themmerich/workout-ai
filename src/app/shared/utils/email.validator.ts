import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\u00C0-\u024F\u1E00-\u1EFF-]+@[a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF-]+(?:\.[a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF-]+)*\.[a-zA-Z]{2,}$/;

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    return EMAIL_PATTERN.test(control.value) ? null : { email: true };
  };
}
