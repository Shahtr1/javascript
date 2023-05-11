import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpComponent } from './sign-up.component';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      imports: [HttpClientTestingModule, SharedModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Layout', () => {
    it('has Sign Up header', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const h1 = signUp.querySelector('h1');
      expect(h1?.textContent?.trim()).toBe('Sign Up');
    });

    it('has username input', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const label = signUp.querySelector('label[for="username"]');
      const input = signUp.querySelector('input[id="username"]');
      expect(input).toBeTruthy();
      expect(label).toBeTruthy();
      expect(label?.textContent?.trim()).toContain('Username');
    });

    it('has email input', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const label = signUp.querySelector('label[for="email"]');
      const input = signUp.querySelector('input[id="email"]');
      expect(input).toBeTruthy();
      expect(label).toBeTruthy();
      expect(label?.textContent?.trim()).toContain('E-mail');
    });

    it('has password input', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const label = signUp.querySelector('label[for="password"]');
      const input = signUp.querySelector('input[id="password"]');
      expect(input).toBeTruthy();
      expect(label).toBeTruthy();
      expect(label?.textContent?.trim()).toContain('Password');
    });

    it('has password type for password input', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const input = signUp.querySelector(
        'input[id="password"]'
      ) as HTMLInputElement;
      expect(input.type).toBe('password');
    });

    it('has password repeat input', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const label = signUp.querySelector('label[for="passwordRepeat"]');
      const input = signUp.querySelector('input[id="passwordRepeat"]');
      expect(input).toBeTruthy();
      expect(label).toBeTruthy();
      expect(label?.textContent?.trim()).toContain('Password Repeat');
    });

    it('has password type for password input', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const input = signUp.querySelector(
        'input[id="passwordRepeat"]'
      ) as HTMLInputElement;
      expect(input.type).toBe('password');
    });

    it('has Sign Up button', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const button = signUp.querySelector('button');
      expect(button?.textContent?.trim()).toBe('Sign Up');
    });

    it('disables the button initially', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const button = signUp.querySelector('button');
      expect(button?.disabled).toBeTruthy();
    });
  });

  describe('Interactions', function () {
    let button: any;
    let httpTestingController: HttpTestingController;
    let signUp: HTMLElement;
    const setupForm = () => {
      httpTestingController = TestBed.inject(HttpTestingController);

      signUp = fixture.nativeElement as HTMLElement;

      const usernameInput = signUp.querySelector(
        'input[id="username"]'
      ) as HTMLInputElement;

      const emailInput = signUp.querySelector(
        'input[id="email"]'
      ) as HTMLInputElement;

      const passwordInput = signUp.querySelector(
        'input[id="password"]'
      ) as HTMLInputElement;

      const passwordRepeatInput = signUp.querySelector(
        'input[id="passwordRepeat"]'
      ) as HTMLInputElement;

      // mimic the user behaviour
      usernameInput.value = 'user1';
      usernameInput.dispatchEvent(new Event('input'));

      emailInput.value = 'user1@gmail.com';
      emailInput.dispatchEvent(new Event('input'));

      passwordInput.value = 'password';
      passwordInput.dispatchEvent(new Event('input'));

      passwordRepeatInput.value = 'password';
      passwordRepeatInput.dispatchEvent(new Event('input'));

      // angular detects changes delayed
      fixture.detectChanges();

      button = signUp.querySelector('button');
    };

    it('enables the button when the password and password repeat fields have same value ', function () {
      setupForm();
      expect(button?.disabled).toBeFalsy();
    });

    it('sends username, email and password to backend after clicking the button ', function () {
      setupForm();
      button.click();

      const req = httpTestingController.expectOne('/api/1.0/users');
      const requestBody = req.request.body;

      expect(requestBody).toEqual({
        username: 'user1',
        password: 'password',
        email: 'user1@gmail.com',
      });
    });

    it('disables button when there is an ongoing api call', () => {
      setupForm();
      button.click();
      fixture.detectChanges(); // make sure ui is updated
      button.click();
      httpTestingController.expectOne('/api/1.0/users');
      expect(button.disabled).toBeTruthy();
    });

    it('displays spinner after clicking the submit', () => {
      setupForm();
      expect(signUp.querySelector('span[role="status"]')).toBeFalsy();

      button.click();
      fixture.detectChanges();
      expect(signUp.querySelector('span[role="status"]')).toBeTruthy();
    });

    it('displays account activation notification after successful sign up request', () => {
      setupForm();
      expect(signUp.querySelector('.alert-success')).toBeFalsy(); // should be visible after clicking the button
      button.click();
      const req = httpTestingController.expectOne('/api/1.0/users');
      req.flush({}); // set response body as an empty object
      fixture.detectChanges();
      const message = signUp.querySelector('.alert-success');
      expect(message?.textContent?.trim()).toBe(
        'Please check your e-mail to activate your account'
      );
    });

    it('hides sign up form after successful sign up request', () => {
      setupForm();
      expect(
        signUp.querySelector('div[data-testid="form-sign-up"]')
      ).toBeTruthy();
      button.click();
      const req = httpTestingController.expectOne('/api/1.0/users');
      req.flush({}); // set response body as an empty object
      fixture.detectChanges();
      expect(
        signUp.querySelector('div[data-testid="form-sign-up"]')
      ).toBeFalsy();
    });
  });

  describe('Validations', function () {
    const testCases = [
      { field: 'username', value: '', error: 'Username is required' },
      {
        field: 'username',
        value: '123',
        error: 'Username must be at least 4 characters long',
      },
      { field: 'email', value: '', error: 'E-mail is required' },
      {
        field: 'email',
        value: 'wrong-format',
        error: 'Invalid e-mail address',
      },
      { field: 'password', value: '', error: 'Password is required' },
      {
        field: 'password',
        value: 'password',
        error:
          'Password must have atleast 1 uppercase, 1 lowercase letter and 1 number',
      },
      {
        field: 'password',
        value: 'passWORD',
        error:
          'Password must have atleast 1 uppercase, 1 lowercase letter and 1 number',
      },
      {
        field: 'password',
        value: 'pas12',
        error:
          'Password must have atleast 1 uppercase, 1 lowercase letter and 1 number',
      },
      {
        field: 'password',
        value: 'PASS1234',
        error:
          'Password must have atleast 1 uppercase, 1 lowercase letter and 1 number',
      },
      {
        field: 'passwordRepeat',
        value: 'pass',
        error: 'Password mismatch',
      },
    ];

    testCases.forEach(({ field, value, error }) => {
      it(`displays ${error} when field has '${value}'`, () => {
        const signUp = fixture.nativeElement as HTMLElement;

        expect(
          signUp.querySelector(`div[data-testid="${field}-validation"]`)
        ).toBeNull();

        const usernameInput = signUp.querySelector(
          `input[id="${field}"]`
        ) as HTMLInputElement;
        usernameInput.value = value;
        usernameInput.dispatchEvent(new Event('input'));
        usernameInput.dispatchEvent(new Event('blur'));

        fixture.detectChanges();

        const validationElement = signUp.querySelector(
          `div[data-testid="${field}-validation"]`
        );

        expect(validationElement?.textContent?.trim()).toBe(error);
      });
    });
  });
});
