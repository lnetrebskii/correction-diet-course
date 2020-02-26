import { Injectable } from '@angular/core';
import {concatMap, map} from "rxjs/operators";
import {of} from "rxjs";
import {AngularFireAuth} from "@angular/fire/auth";
import {UsersService} from "./users.service";
import * as firebase from "firebase";

@Injectable({
  providedIn: 'root'
})
export class DietAuthService {

  constructor(private afAuth: AngularFireAuth,
              private usersService: UsersService) { }

  isLoggedIn() {
    return this.afAuth.authState.pipe(map(user => !!user));
  }

  isLoggedOut() {
    return this.isLoggedIn().pipe(map(loggedIn => !loggedIn));
  }

  isAdmin() {
    return this.afAuth.authState.pipe(
      concatMap(user =>
        user ? this.usersService.get(user.uid) : of({ isAdmin: false })
      ),
      map(user => user ? user.isAdmin : false)
    );
  }

  getPictureUrl() {
    return this.afAuth.authState.pipe(
      map(user => user ? user.photoURL : null)
    );
  }

  signOut() {
    return firebase.auth().signOut();
  }

}
