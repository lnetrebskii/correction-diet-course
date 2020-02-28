import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import * as firebase from "firebase";
import * as firebaseui from "firebaseui";
import {AngularFireAuth} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {DietAuthService} from "../services/diet-auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(private router:Router,
              private ngZone: NgZone,
              private dietAuthService: DietAuthService) { }

  ngOnInit() {

    this.dietAuthService.initAuthUI('#firebaseui-auth-container', this.onLoginSuccessful)

  }

  onLoginSuccessful(result) {

    this.ngZone.run(() => this.router.navigateByUrl('/home'));

  }

  ngOnDestroy(): void {

    this.dietAuthService.terminateAuthUI();

  }

}
