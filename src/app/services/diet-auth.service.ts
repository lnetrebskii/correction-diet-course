import { Injectable } from '@angular/core';
import {concatMap, map} from "rxjs/operators";
import {of} from "rxjs";
import {AngularFireAuth} from "@angular/fire/auth";
import {UsersService} from "./users.service";
import * as firebase from "firebase";
import * as firebaseui from "firebaseui";

@Injectable({
  providedIn: 'root'
})
export class DietAuthService {

  ui: firebaseui.auth.AuthUI;

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

  initAuthUI(element: string, onLoginSuccessful) {
    const uiConfig = {

      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],

      callbacks: {

        signInSuccessWithAuthResult:
          onLoginSuccessful
          .bind(this)

      }

    };

    this.ui = new firebaseui.auth.AuthUI(firebase.auth());

    this.ui.start(element, uiConfig);
  }

  terminateAuthUI() {

    return this.ui.delete();

  }

}
