import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {DietUser} from "../model/dietUser";
import {first, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private db: AngularFirestore) { }

  get(uid: string): Observable<DietUser> {

    return this.db.doc(`users/${uid}`)
      .get()
      .pipe(
        map(snap => {
          return <DietUser>{
              id: snap.id,
              ...snap.data()
          };
        })
      );

  }
}
