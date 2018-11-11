import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { User } from './../../models/user';
import { CustomValidators } from './../../validators';

@Component({
  selector: 'app-signup-reactive-form',
  templateUrl: './signup-reactive-form.component.html',
  styleUrls: ['./signup-reactive-form.component.css']
})
export class SignupReactiveFormComponent implements OnInit, OnDestroy {
  private sub: Subscription;

  private validationMessages = {
    email: {
      required: 'Please enter your email address.',
      pattern: 'Please enter a valid email address.',
      email: 'Please enter a valid email address.',
      asyncEmailInvalid: 'This email already exists. Please enter other email address.'
    }
  };

  countries: Array<string> = [
    'Ukraine',
    'Armenia',
    'Belarus',
    'Hungary',
    'Kazakhstan',
    'Poland'
  ];
  user: User = new User();
  userForm: FormGroup;
  validationMessage: string;

  placeholder = {
    email: 'Email (required)',
    confirmEmail: 'Confirm Email (required)',
    phone: 'Phone'
  };

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    this.watchValueChanges();
    // this.createForm();
    // this.setFormValues();
    // this.patchFormValues();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onAddAddress(): void {
    this.addresses.push(this.buildAddress());
  }

  onBlur() {
    const emailControl = this.userForm.get('emailGroup.email');
    this.setValidationMessage(emailControl, 'email');
  }

  get addresses(): FormArray {
    return <FormArray>this.userForm.get('addresses');
  }

  save() {
    // Form model
    console.log(this.userForm);
    // Form value w/o disabled controls
    console.log(`Saved: ${JSON.stringify(this.userForm.value)}`);
    // Form value w disabled controls
    console.log(`Saved: ${JSON.stringify(this.userForm.getRawValue())}`);
  }

  private buildForm() {
    this.userForm = this.fb.group({
      // firstName: ['', [Validators.required, Validators.minLength(3)]],
      firstName: new FormControl('', { validators: [Validators.required, Validators.minLength(3)], updateOn: 'blur' }),
      lastName: { value: 'Moskovych', disabled: true },
      emailGroup: this.fb.group({
        email: ['',
          [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+'), Validators.email]
        ],
        confirmEmail: ['', Validators.required],
      }, { validator: CustomValidators.emailMatcher }),
      phone: '',
      notification: 'email',
      // serviceLevel: ['', CustomValidators.serviceLevelRange(1, 3)],
      serviceLevel: [],
      sendProducts: true,
      addresses: this.fb.array([this.buildAddress()])
    });
  }

  private buildAddress(): FormGroup {
    return this.fb.group({
      addressType: 'home',
      country: '',
      city: '',
      zip: '',
      street1: '',
      street2: ''
    });
  }

  private createForm() {
    this.userForm = new FormGroup({
      firstName: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
        updateOn: 'blur'
      }),
      lastName: new FormControl(),
      email: new FormControl(),
      phone: new FormControl(),
      notification: new FormControl('email'),
      serviceLevel: new FormControl('', {
        validators: [CustomValidators.serviceLevel],
        updateOn: 'blur'
      }),
      sendProducts: new FormControl(true)
    });
  }

  private setFormValues() {
    this.userForm.setValue({
      firstName: 'Taras',
      lastName: 'Moskovych',
      email: 'moskovych.taras@gmail.com',
      sendProducts: false
    });
  }

  private setNotification(notifyVia: string) {
    const controls = new Map();
    controls.set('phoneControl', this.userForm.get('phone'));
    controls.set('emailGroup', this.userForm.get('emailGroup'));
    controls.set('emailControl', this.userForm.get('emailGroup.email'));
    controls.set('confirmEmailControl', this.userForm.get('emailGroup.confirmEmail'));

    if (notifyVia === 'text') {
      controls.get('phoneControl').setValidators(Validators.required);
      controls.forEach((control, index) => index !== 'phoneControl' && control.clearValidators());

      this.placeholder = {
        phone: 'Phone (required)',
        email: 'Email',
        confirmEmail: 'Confirm Email'
      };
    } else {
      controls.get('emailControl').setValidators(
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+'),
          Validators.email
        ]
      );
      controls.get('confirmEmailControl').setValidators([Validators.required]);
      controls.get('emailGroup').setValidators([CustomValidators.emailMatcher]);
      controls.get('phoneControl').clearValidators();

      this.placeholder = {
        phone: 'Phone',
        email: 'Email (required)',
        confirmEmail: 'Confirm Email (required)'
      };
    }
    controls.forEach(control => control.updateValueAndValidity());
  }

  private patchFormValues() {
    this.userForm.patchValue({
      firstName: 'Taras',
      lastName: 'Moskovych'
    });
  }

  private setValidationMessage(c: AbstractControl, controlName: string) {
    this.validationMessage = '';

    if ((c.touched || c.dirty) && c.errors) {
      this.validationMessage = Object.keys(c.errors)
        .map(key => this.validationMessages[controlName][key]).join(' ');
    }
  }

  private watchValueChanges() {
    this.sub = this.userForm.get('notification').valueChanges.subscribe(value => this.setNotification(value));

    const emailControl = this.userForm.get('emailGroup.email');
    const sub = emailControl.valueChanges
    .pipe(debounceTime(1000))
    .subscribe((value) => {
      this.setValidationMessage(emailControl, 'email');
      console.log(value);
    });
    this.sub.add(sub);
  }
}
