import {async, ComponentFixture, fakeAsync, flush, TestBed} from '@angular/core/testing';

import {Location} from "@angular/common";
import { LoginComponent } from './login.component';
import {CoursesModule} from "../courses.module";
import {DietAuthService} from "../services/diet-auth.service";
import {RouterTestingModule} from "@angular/router/testing";
import {HomeComponent} from "../home/home.component";
import {routes} from "../app-routing.module";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let location: Location;

  beforeEach(async(() => {

    const dietAuthServiceSpy = jasmine.createSpyObj('DietAuthService', ['initAuthUI', 'terminateAuthUI']);

    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        RouterTestingModule.withRoutes(routes)
      ],
      providers: [
        { provide: DietAuthService, useValue: dietAuthServiceSpy }
      ]
    })
    .compileComponents();

    location = TestBed.get(Location);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init auth UI', () => {

    let dietAuthService = TestBed.get(DietAuthService);

    expect(dietAuthService.initAuthUI).toHaveBeenCalledTimes(1);

  });

  it('should terminate auth UI', () => {

    let dietAuthService = TestBed.get(DietAuthService);
    component.ngOnDestroy();

    expect(dietAuthService.terminateAuthUI).toHaveBeenCalledTimes(1);

  });

  it('should go to home page after successful login', fakeAsync(() => {

    component.onLoginSuccessful(null);
    flush();
    expect(location.path()).toBe("/")

  }));

});
