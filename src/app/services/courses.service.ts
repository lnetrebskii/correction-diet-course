import { Injectable } from '@angular/core';
import {convertSnaps} from "./db-utils";
import {first, map} from "rxjs/operators";
import {Course} from "../model/course";
import {from, Observable} from "rxjs";
import {AngularFirestore} from "@angular/fire/firestore";
import {Moment} from "moment";
import Timestamp = firebase.firestore.Timestamp;
import * as firebase from 'firebase';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private db: AngularFirestore) { }

  saveCourse(courseId:string, changes: Partial<Course>): Observable<any> {

    return from(this.db.doc(`courses/${courseId}`).update(CourseEntity.fromCourse(changes)));

  }

  createCourse(course: Partial<Course>): Observable<any> {

    return from(this.db.collection('courses').add(CourseEntity.fromCourse(course)));

  }

  loadAllCourses(): Observable<Course[]> {
    return this.db.collection(
      'courses',
      ref=> ref.orderBy("endsOn")
    )
      .snapshotChanges()
      .pipe(
        map(snaps => {
          return convertSnaps<CourseEntity>(snaps);
        }),
        map(courseEntities => courseEntities.map(courseEntity => CourseEntity.toCourse(courseEntity))),
        first());
  }

}

class CourseEntity {
  url: string;
  startsOn: Timestamp | Moment;
  endsOn: Timestamp | Moment;
  id:string;
  titles: {
    description:string;
    longDescription: string;
  };
  iconUrl: string;

  static fromCourse(course: Partial<Course>): Partial<CourseEntity> {

    let courseEntity: Partial<CourseEntity> = {
      titles: course.titles,
      iconUrl: course.iconUrl
    }

    if (course.startsOn) {
      courseEntity.startsOn = Timestamp.fromMillis(course.startsOn.valueOf());
    }

    if (course.endsOn) {
      courseEntity.endsOn = Timestamp.fromMillis(course.endsOn.valueOf());
    }

    return courseEntity;
  }

  static toCourse(courseEntity: CourseEntity): Course {

    if (courseEntity.startsOn) {
      courseEntity.startsOn = moment((<Timestamp>courseEntity.startsOn).toMillis());
    }
    if (courseEntity.endsOn) {
      courseEntity.endsOn = moment((<Timestamp>courseEntity.endsOn).toMillis());
    }

    let course = <Course>courseEntity;
    course.isActive = course.endsOn >= moment();

    return <Course>course;
  }
}
