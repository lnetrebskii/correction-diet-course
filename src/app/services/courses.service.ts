import { Injectable } from '@angular/core';
import {convertSnaps} from "./db-utils";
import {first, map} from "rxjs/operators";
import {Course} from "../model/course";
import {from, Observable} from "rxjs";
import {AngularFirestore} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private db: AngularFirestore) { }

  saveCourse(courseId:string, changes: Partial<Course>): Observable<any> {

    return from(this.db.doc(`courses/${courseId}`).update(changes));

  }

  createCourse(course: Partial<Course>): Observable<any> {

    return from(this.db.collection('courses').add(course));

  }

  loadAllCourses(): Observable<Course[]> {
    return this.db.collection(
      'courses',
      ref=> ref.orderBy("endsOn")
    )
      .snapshotChanges()
      .pipe(
        map(snaps => {
          return convertSnaps<Course>(snaps);
        }),
        first());
  }

}
