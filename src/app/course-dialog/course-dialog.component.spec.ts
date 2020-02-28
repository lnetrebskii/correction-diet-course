import {async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed} from '@angular/core/testing';

import { CourseDialogComponent } from './course-dialog.component';
import {DebugElement} from "@angular/core";
import {CoursesModule} from "../courses.module";
import {DietAuthService} from "../services/diet-auth.service";
import {CoursesService} from "../services/courses.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {setupCourses} from "../common/test-db-data";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {from, Observable, of} from "rxjs";

describe('CourseDialogComponent', () => {
  let component: CourseDialogComponent;
  let fixture: ComponentFixture<CourseDialogComponent>;
  let el: DebugElement;

  beforeEach(async(() => {

    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', {
      "saveCourse": of([]),
      "createCourse": of([])
    });

    const matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['open', 'close']);

    TestBed.configureTestingModule({
      imports: [CoursesModule, NoopAnimationsModule],
      providers: [
        { provide: CoursesService, useValue: coursesServiceSpy },
        { provide: MatDialogRef, useValue: matDialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: setupCourses()[0] }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close on save', fakeAsync(() => {

    const dialogRef = TestBed.inject(MatDialogRef);

    component.save();
    flush();

    expect(dialogRef.close).toHaveBeenCalledTimes(1);

  }));

  it('should close on scheduleNew', fakeAsync(() => {

    const dialogRef = TestBed.inject(MatDialogRef);

    component.scheduleNew();
    flush();

    expect(dialogRef.close).toHaveBeenCalledTimes(1);

  }));

});
