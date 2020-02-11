import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import 'firebase/firestore';
import {AngularFireAuth} from "@angular/fire/auth";
import * as firebase from "firebase";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;

  isLoggedOut$:Observable<boolean>;

  pictureUrl$: Observable<string>;

  constructor(private db: AngularFirestore,
              private afAuth: AngularFireAuth) {

  }

  ngOnInit() {

    this.db.collection('courses').valueChanges()
      .subscribe(val => console.log(val));

    this.isLoggedIn$ = this.afAuth.authState.pipe(map(user => !!user));

    this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn => !loggedIn));

    this.pictureUrl$ =
      this.afAuth.authState.pipe(map(user => user ? user.photoURL: null));

  }

  onLoginSuccessful() {

  }

  logout() {

    firebase.auth().signOut();

  }

}
