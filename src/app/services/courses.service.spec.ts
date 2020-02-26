import {fakeAsync, flushMicrotasks, TestBed} from '@angular/core/testing';

import { CoursesService } from './courses.service';
import {AngularFirestore, QueryFn} from "@angular/fire/firestore";
import {of} from "rxjs";
import Timestamp = firebase.firestore.Timestamp;
import * as firebase from 'firebase';
import * as moment from 'moment';

describe('CoursesService', () => {
  let firestoreSpy: any;

  function setReturnCollection(dataMap: Map<string, any>) {
    firestoreSpy.collection.and.callFake(function (path: string, queryFn?: QueryFn) {
      return {
        snapshotChanges: () => {
          return of(Array.from(dataMap.keys())
            .map((key) => {
              return {
                payload: {
                  doc: {
                    id: key,
                    data: () => { return { ...dataMap.get(key) } }
                  }
                }
              }
            })
          )
        }
      };
    });
  }

  beforeEach(() => {
    firestoreSpy = jasmine.createSpyObj('AngularFirestore', ['collection']);

    TestBed.configureTestingModule({
      providers: [
        CoursesService,
        { provide: AngularFirestore, useValue: firestoreSpy }
      ]
    });

  });

  it('should return 2 Courses instance', fakeAsync(() => {
    setReturnCollection(
      new Map()
        .set("1", { url: "https://1.test" })
        .set("2", { url: "https://2.test" })
    );

    const service: CoursesService = TestBed.get(CoursesService);

    service.loadAllCourses()
      .subscribe(courses => {
        expect(courses.length).toBe(2);
      });

    flushMicrotasks();

  }));

  it('should return 1 initialized course instance', fakeAsync(() => {
    setReturnCollection(
      new Map()
        .set("1",
          {
            url: "https://1.test"
          })
    );

    const service: CoursesService = TestBed.get(CoursesService);

    service.loadAllCourses()
      .subscribe(courses => {

        expect(courses.length).toBe(1);
        expect(courses[0].id).toBeTruthy();
        expect(courses[0].url).toBeTruthy();

      });

    flushMicrotasks();

  }));

  it('should return 1 course instance and complete', fakeAsync(() => {
    setReturnCollection(
      new Map()
        .set("1", { url: "https://1.test" })
    );

    const service: CoursesService = TestBed.get(CoursesService);
    let observableCompleted = false;

    let courses$ = service.loadAllCourses()
      .subscribe(courses => {
        expect(courses.length).toBe(1);
      },
        () => { },
        () => { observableCompleted = true; }
        );

    flushMicrotasks();

    expect(observableCompleted).toBeTruthy();

  }));

  it('should convert startsOn and endsOn into Moment type', () => {

    let startsOn = moment('2020-01-01');
    let endsOn = moment('2020-01-02');

    setReturnCollection(
      new Map()
        .set("1",
          {
            url: "https://1.test",
            startsOn: Timestamp.fromMillis(startsOn.valueOf()),
            endsOn: Timestamp.fromMillis(endsOn.valueOf()),
          })
    );

    const service: CoursesService = TestBed.get(CoursesService);

    service.loadAllCourses()
      .subscribe(courses => {

        expect(courses[0].startsOn.valueOf()).toBe(startsOn.valueOf());
        expect(courses[0].endsOn.valueOf()).toEqual(endsOn.valueOf());

      });

  });

});
