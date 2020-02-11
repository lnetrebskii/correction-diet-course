import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import * as firebase from "firebase";
import * as firebaseui from "firebaseui";
import {AngularFireAuth} from "@angular/fire/auth";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  ui: firebaseui.auth.AuthUI;

  constructor(private router:Router,
              private ngZone: NgZone) { }

  ngOnInit() {

    const uiConfig = {

      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],

      callbacks: {

        signInSuccessWithAuthResult: this
          .onLoginSuccessful
          .bind(this)

      }

    };

    this.ui = new firebaseui.auth.AuthUI(firebase.auth());

    this.ui.start('#firebaseui-auth-container', uiConfig);

  }

  onLoginSuccessful(result) {

    this.ngZone.run(() => this.router.navigateByUrl('/home'));

  }

  ngOnDestroy(): void {

    this.ui.delete();

  }

}
