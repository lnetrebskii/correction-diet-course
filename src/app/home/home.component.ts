import {Component, OnInit} from '@angular/core';
import {Course} from '../model/course';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {CoursesService} from '../services/courses.service';
import Timestamp = firebase.firestore.Timestamp;
import * as firebase from 'firebase';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {CourseDialogComponent} from "../course-dialog/course-dialog.component";
import {DietAuthService} from "../services/diet-auth.service";


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  courses$: Observable<Course[]>;

  activeCourses$: Observable<Course[]>;

  archivedCourses$: Observable<Course[]>;

  isAdmin$: Observable<boolean>;

  constructor(private coursesService: CoursesService,
              private dietAuthService: DietAuthService,
              private dialog: MatDialog) {

  }

  ngOnInit() {

    this.isAdmin$ = this.dietAuthService.isAdmin();

    console.log("IsAdmin: ", this.isAdmin$);

    this.reloadCourses();

  }

  reloadCourses() {
    this.courses$ = this.coursesService.loadAllCourses();

    let now = Timestamp.fromDate(new Date());
    console.log("Date now: ", now);

    this.activeCourses$ = this.courses$.pipe(
      map(courses => courses.filter(
        course => course.endsOn > now)),
      tap(courses => console.log("Courses: ", courses))
    );

    this.archivedCourses$ = this.courses$.pipe(
      map(courses => courses.filter(
        course => course.endsOn <= now)));
  }

  createCourse() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    this.dialog.open(CourseDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((val) => {
        if (val) {
          this.reloadCourses();
        }});
  }
}
