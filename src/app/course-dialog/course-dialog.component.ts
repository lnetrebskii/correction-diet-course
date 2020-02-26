import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {CoursesService} from '../services/courses.service';
import * as moment from "moment";
import {isDefined} from "@angular/compiler/src/util";
import {Moment} from "moment";

@Component({
  selector: 'course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

  form: FormGroup;
  description:string;
  isScheduleNew:boolean;

  course: Course;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course :Course,
    private coursesService: CoursesService) {

    this.isScheduleNew = !isDefined(course);
    this.course = course;

    const formData = this.isScheduleNew ? this.formDataForCreate() : this.formDataForEdit(course);

    this.form = fb.group({
      description: [formData.description, Validators.required],
      longDescription: [formData.longDescription,Validators.required],
      iconUrl: [formData.iconUrl,Validators.pattern(/^(http|https):/)],
      dates: [{begin: formData.startsOn.toDate(), end: formData.endsOn.toDate()}, Validators.required]
    });

  }

  ngOnInit() {

  }

  save() {

    this.coursesService.saveCourse(this.course.id, this.getCoursePartial())
        .subscribe(
          () => this.dialogRef.close(this.form.value)
        );
  }

  scheduleNew() {

    this.coursesService.createCourse(this.getCoursePartial())
      .subscribe(
        () => this.dialogRef.close(this.form.value)
      );

  }

  close() {
    this.dialogRef.close();
  }

  private formDataForEdit(course: Course) {
    const formData =
      {
        startsOn: course.startsOn,
        endsOn: course.endsOn,
        iconUrl: course.iconUrl,
        ...course.titles
      };

    return formData;
  }

  private formDataForCreate() {
    const formData =
      {
        startsOn: moment(),
        endsOn: moment(),
        description: "",
        longDescription: "",
        iconUrl: ""
      };

    return formData;
  }

  private getCoursePartial(): Partial<Course> {
    const changes = this.form.value;

    let changesToSave: Partial<Course> = {
      titles:
        {
          description: changes.description,
          longDescription: changes.longDescription
        },
      iconUrl: changes.iconUrl,
      startsOn: moment(changes.dates.begin),
      endsOn: moment(changes.dates.end)
    };
    return changesToSave;
  }

}
