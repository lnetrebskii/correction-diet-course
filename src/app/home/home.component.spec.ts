import {async, ComponentFixture, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';

import { HomeComponent } from './home.component';
import {DebugElement} from "@angular/core";
import {BehaviorSubject, Observable, of} from "rxjs";
import {Course} from "../model/course";
import {setupCourses} from "../common/test-db-data";
import Timestamp = firebase.firestore.Timestamp;
import * as firebase from 'firebase';
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {CoursesModule} from "../courses.module";
import {CoursesService} from "../services/courses.service";
import {DietAuthService} from "../services/diet-auth.service";
import {By} from "@angular/platform-browser";
import {click} from "../common/test-utils";

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let el: DebugElement;
  let coursesService: any;
  let isAdminSubject = new BehaviorSubject(false);

  const activeCourses = setupCourses()
    .filter(course => course.isActive);

  const archivedCourses = setupCourses()
    .filter(course => !course.isActive);

  beforeEach(async(() => {

    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['loadAllCourses']);

    const dietAuthServiceSpy = jasmine.createSpyObj('DietAuthService', {'isAdmin': isAdminSubject});

    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: CoursesService, useValue: coursesServiceSpy },
        { provide: DietAuthService, useValue: dietAuthServiceSpy }
      ]
    })
    .compileComponents()
      .then(() => {
        coursesService = TestBed.get(CoursesService);
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;

      });
  }));

  it("should display only active courses", () => {

    coursesService.loadAllCourses.and.returnValue(of(activeCourses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');
    const label = tabs[0].query(By.css(".mat-tab-label-content"));
    expect(label.nativeElement.innerText).toBe("Active");

  });

  it("should display only archived courses", () => {

    coursesService.loadAllCourses.and.returnValue(of(archivedCourses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');
    const label = tabs[0].query(By.css(".mat-tab-label-content"));
    expect(label.nativeElement.innerText).toBe("Archived");

  });

  it("should display both tabs", () => {

    coursesService.loadAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(2, "Expected to find 2 tabs");

  });

  it("should display archived courses when tab clicked", fakeAsync(() => {

    coursesService.loadAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll((By.css(".mat-tab-label")));

    click(tabs[1]);

    fixture.detectChanges();

    flush();

    const cardTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'));

    expect(cardTitles.length).toBeGreaterThan(0,"Could not find card titles");

    expect(cardTitles[0].nativeElement.textContent).toContain("Summer correction course");

  }));

  it('should show SCHEDULE NEW button to an admin user',() => {

    coursesService.loadAllCourses.and.returnValue(of([]));
    isAdminSubject.next(true);

    fixture.detectChanges();

    const buttons = el.queryAll(By.css(".mat-accent"));

    expect(buttons.length).toBe(1);
    expect(buttons[0].nativeElement.textContent).toContain("SCHEDULE NEW");

  });

  it('should NOT show SCHEDULE NEW button to a non-admin user',() => {

    coursesService.loadAllCourses.and.returnValue(of([]));
    isAdminSubject.next(false);

    fixture.detectChanges();

    const buttons = el.queryAll(By.css(".mat-accent"));

    expect(buttons.length).toBe(0);

  });

});
