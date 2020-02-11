import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import 'firebase/firestore';
import {AngularFireAuth} from "@angular/fire/auth";
import * as firebase from "firebase";
import {Observable, of} from "rxjs";
import {concatMap, map} from "rxjs/operators";
import {UsersService} from "./services/users.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;

  isLoggedOut$:Observable<boolean>;

  isAdmin$: Observable<boolean>;

  pictureUrl$: Observable<string>;

  constructor(private afAuth: AngularFireAuth,
              private usersService: UsersService) {

  }

  ngOnInit() {

    this.isLoggedIn$ = this.afAuth.authState.pipe(map(user => !!user));

    this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn => !loggedIn));

    this.isAdmin$ = this.afAuth.authState.pipe(
      concatMap(user =>
        user ? this.usersService.get(user.uid) : of({ isAdmin: false })
      ),
      map(user => user.isAdmin)
    );

    this.pictureUrl$ =
      this.afAuth.authState.pipe(
        map(user => user ? user.photoURL: null)
      );

  }

  onLoginSuccessful() {

  }



  logout() {

    firebase.auth().signOut();

  }

}
