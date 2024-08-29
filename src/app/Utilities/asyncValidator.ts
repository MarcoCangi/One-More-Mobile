import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export function asyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    // Simuliamo un ritardo di 2 secondi
    return of(null).pipe(delay(2000));
}