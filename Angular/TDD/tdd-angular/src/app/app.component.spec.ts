import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { routes } from './router/app-router.module';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from './shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { ActivateComponent } from './activate/activate.component';
import { UserComponent } from './user/user.component';
import { UserListComponent } from './home/user-list/user-list.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;

  let appComponent: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
        SharedModule,
        ReactiveFormsModule,
      ],

      declarations: [
        AppComponent,
        SignUpComponent,
        HomeComponent,
        LoginComponent,
        ActivateComponent,
        UserComponent,
        UserListComponent,
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(AppComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
    appComponent = fixture.nativeElement;
  });

  describe('Routing', () => {
    const routingTests = [
      { path: '/', pageId: 'home-page' },
      { path: '/signup', pageId: 'sign-up-page' },
      { path: '/login', pageId: 'login-page' },
      { path: '/user/1', pageId: 'user-page' },
      { path: '/user/2', pageId: 'user-page' },
      { path: '/activate/123', pageId: 'activation-page' },
      { path: '/activate/456', pageId: 'activation-page' },
    ];

    routingTests.forEach(async ({ path, pageId }) => {
      it(`displays ${pageId} at ${path}`, async () => {
        await router.navigate([path]);
        fixture.detectChanges();

        const page = appComponent.querySelector(`[data-testid="${pageId}"]`);
        expect(page).toBeTruthy();
      });
    });

    const linkTests = [
      { path: '/', title: 'Home' },
      { path: '/signup', title: 'Sign Up' },
      { path: '/login', title: 'Login' },
    ];

    linkTests.forEach(({ path, title }) => {
      it(`has link with title ${title} to ${path}`, () => {
        const linkElement = appComponent.querySelector(
          `a[title="${title}"]`
        ) as HTMLAnchorElement;
        expect(linkElement.pathname).toEqual(path);
      });
    });

    const navigationTests = [
      { initialPath: '/', clickingTo: 'Sign Up', visiblePage: 'sign-up-page' },
      { initialPath: '/signup', clickingTo: 'Home', visiblePage: 'home-page' },
      { initialPath: '/', clickingTo: 'Login', visiblePage: 'login-page' },
    ];

    navigationTests.forEach(({ initialPath, clickingTo, visiblePage }) => {
      it(`displays ${visiblePage} after clicking to ${clickingTo} link`, fakeAsync(async () => {
        await router.navigate([initialPath]);

        const linkElement = appComponent.querySelector(
          `a[title="${clickingTo}"]`
        ) as HTMLAnchorElement;

        linkElement.click();
        tick();
        // By calling tick(), we ensure that the navigation is completed before running the assertion,
        // and the test can pass or fail based on the expected outcome.

        fixture.detectChanges();

        const page = appComponent.querySelector(
          `[data-testid="${visiblePage}"]`
        );
        expect(page).toBeTruthy();
      }));
    });
  });
});
