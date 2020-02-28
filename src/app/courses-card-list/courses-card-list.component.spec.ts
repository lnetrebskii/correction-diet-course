import {async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed} from '@angular/core/testing';

import { CoursesCardListComponent } from './courses-card-list.component';
import {setupCourses} from "../common/test-db-data";
import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";
import {CoursesModule} from "../courses.module";
import {DietAuthService} from "../services/diet-auth.service";
import {BehaviorSubject, of} from "rxjs";

describe('CoursesCardListComponent', () => {
  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let el: DebugElement;
  let isAdminSubject = new BehaviorSubject(false);

  beforeEach(async(() => {

    const dietAuthServiceSpy = jasmine.createSpyObj('DietAuthService', {'isAdmin': isAdminSubject});

    TestBed.configureTestingModule({
      imports: [CoursesModule],
      providers: [
        { provide: DietAuthService, useValue: dietAuthServiceSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the course list', () => {

    component.courses = setupCourses();

    fixture.detectChanges();

    const cards = el.queryAll(By.css(".course-card"));

    expect(cards).toBeTruthy("Could not find cards");
    expect(cards.length).toBe(4, "Unexpected number of courses");

  });

  it('should display the first course', () => {

    component.courses = setupCourses();

    fixture.detectChanges();

    const course = component.courses[0];

    const card = el.query(By.css(".course-card:first-child"));
    const title = card.query(By.css("mat-card-title"));
    const image = card.query(By.css("img"));

    expect(card).toBeTruthy("Could not find course card");

    expect(title.nativeElement.textContent).toBe(course.titles.description);

    expect(image.nativeElement.src).toBe(course.iconUrl);

  });

  it('should show EDIT button to an admin user',() => {

    isAdminSubject.next(true);
    component.courses = setupCourses();

    fixture.detectChanges();

    const card = el.query(By.css(".course-card:first-child"));
    const editBtn = card.query(By.css(".mat-accent"));

    expect(editBtn).toBeTruthy();
    expect(editBtn.nativeElement.textContent).toContain("EDIT");
  });

  it('should NOT show EDIT button to a non-admin user',() => {

    isAdminSubject.next(false);
    component.courses = setupCourses();

    fixture.detectChanges();

    const card = el.query(By.css(".course-card:first-child"));
    const editBtn = card.query(By.css(".mat-accent"));

    expect(editBtn).toBeFalsy();

  });

});
