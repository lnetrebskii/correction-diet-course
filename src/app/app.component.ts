import {Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import 'firebase/firestore';
import {Observable, of} from "rxjs";
import {DietAuthService} from "./services/diet-auth.service";

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

  languages = [
    { code: 'en', dir: '', label: 'EN'},
    { code: 'ru', dir: '/ru', label: 'RU'}
  ];

  constructor(
    @Inject(LOCALE_ID) public localeId: string,
    private dietAuthService: DietAuthService) {

  }

  ngOnInit() {

    this.isLoggedIn$ = this.dietAuthService.isLoggedIn();

    this.isLoggedOut$ = this.dietAuthService.isLoggedOut();

    this.isAdmin$ = this.dietAuthService.isAdmin();

    this.pictureUrl$ = this.dietAuthService.getPictureUrl();

  }

  onLoginSuccessful() {

  }



  logout() {

    this.dietAuthService.signOut();

  }

}
