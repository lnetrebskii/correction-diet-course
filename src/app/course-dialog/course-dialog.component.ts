import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {CoursesService} from '../services/courses.service';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;
import * as moment from "moment";
import {convertToMoment, convertToTimestamp} from "../services/db-utils";
import {isDefined} from "@angular/compiler/src/util";

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
      startsOn: [formData.startsOn, Validators.required],
      endsOn: [formData.endsOn, Validators.required]
    });

  }

  formDataForEdit(course: Course) {
    const formData =
    {
      startsOn: convertToMoment(course.startsOn),
      endsOn: convertToMoment(course.endsOn),
      iconUrl: course.iconUrl,
      ...course.titles
    };

    return formData;
  }

  formDataForCreate() {
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

  ngOnInit() {

  }

  save() {

      const changes = this.form.value;

      console.log("Changes: ", changes);

      this.coursesService.saveCourse(this.course.id, {
        titles:
          {
            description: changes.description,
            longDescription: changes.longDescription
          },
        startsOn: convertToTimestamp(changes.startsOn),
        endsOn: convertToTimestamp(changes.endsOn),
        iconUrl: changes.iconUrl
      })
        .subscribe(
          () => this.dialogRef.close(this.form.value)
        );
  }

  scheduleNew() {

    const changes = this.form.value;

    console.log("Changes: ", changes);

    this.coursesService.createCourse({
      titles:
        {
          description: changes.description,
          longDescription: changes.longDescription
        },
      startsOn: convertToTimestamp(changes.startsOn),
      endsOn: convertToTimestamp(changes.endsOn),
      iconUrl: changes.iconUrl
    })
      .subscribe(
        () => this.dialogRef.close(this.form.value)
      );
  }

  close() {
    this.dialogRef.close();
  }

}
