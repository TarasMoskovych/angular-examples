import { Directive, Input } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

import { checkServiceLevel } from './custom.validators';

@Directive({
  selector: '[appServiceLevelValidator]',
  providers: [{
      provide: NG_VALIDATORS,
      useExisting: ServiceLevelDirective,
      multi: true
  }]
})
export class ServiceLevelDirective implements Validator {
  @Input() param1 = 1;
  @Input() param2 = 5;

  validate(c: AbstractControl): { [key: string]: boolean } | null {
    return checkServiceLevel(c, this.param1, this.param2);
  }
}
