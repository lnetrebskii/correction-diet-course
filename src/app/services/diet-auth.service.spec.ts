import {async, inject, TestBed} from '@angular/core/testing';

import { DietAuthService } from './diet-auth.service';
import {AngularFireAuth} from "@angular/fire/auth";
import {UsersService} from "./users.service";
import {of} from "rxjs";

describe('DietAuthService', () => {

  let mockAngularFireAuth: any;
  let usersServiceSpy: any;

  beforeEach(() => {

    usersServiceSpy = jasmine.createSpyObj("UsersService", ['get']);
    mockAngularFireAuth = {
      authState: of({
        displayName: null,
        isAnonymous: false,
        uid: '17WvU2Vj58SnTz8v7EqyYYb0WRc2'
      })
    };

    TestBed.configureTestingModule({
      providers: [
        DietAuthService,
        { provide: AngularFireAuth, useValue: mockAngularFireAuth },
        { provide: UsersService, useValue: usersServiceSpy }
      ]
    });

  });

  it('returns false for isAdmin() when a diet user is not found', () => {

    usersServiceSpy.get.and.returnValue(of (null));
    const service: DietAuthService = TestBed.get(DietAuthService);

    service.isAdmin()
      .subscribe((isAdmin) => {

        expect(isAdmin).toBeFalsy();

      });

  });

  it('returns true for isLoggedIn() when user authenticated', () => {

    const service: DietAuthService = TestBed.get(DietAuthService);

    service.isLoggedIn()
      .subscribe((isLoggedIn) => {

        expect(isLoggedIn).toBeTruthy();

      });

  });

  it('returns photoUrl when it exists', () => {

    mockAngularFireAuth.authState = of({ photoURL: "https://test.test/photo.png" });
    const service: DietAuthService = TestBed.get(DietAuthService);

    service.getPictureUrl()
      .subscribe((url) => {

        expect(url).toBe("https://test.test/photo.png");

      });

  });

  it('returns null when photoUrl does not exist', () => {
    mockAngularFireAuth.authState = of({ photoURL: null });
    const service: DietAuthService = TestBed.get(DietAuthService);

    service.getPictureUrl()
      .subscribe((url) => {

        console.log("picture url: ", url);
        expect(url).toBeNull();

      });

  });

  it('returns false for isLoggedIn() when user is NOT authenticated', () => {

    mockAngularFireAuth.authState = of(null);
    const service: DietAuthService = TestBed.get(DietAuthService);

    service.isLoggedIn()
      .subscribe((isLoggedIn) => {

        expect(isLoggedIn).toBeFalsy();

      });

  });

  it('returns false for isAdmin() when user is not authenticated', () => {

    mockAngularFireAuth.authState = of(null);

    usersServiceSpy.get.and.returnValue(of ({ isAdmin: true }));
    const service: DietAuthService = TestBed.get(DietAuthService);

    service.isAdmin()
      .subscribe((isAdmin) => {

        expect(isAdmin).toBeFalsy();

      });

  });

  it('returns true for isAdmin() if a diet user exist and it has isAdmin property true', async(() => {

    usersServiceSpy.get.and.returnValue(of ({ isAdmin: true }));
    const service: DietAuthService = TestBed.get(DietAuthService);

    service.isAdmin()
      .subscribe((isAdmin) => {

        expect(isAdmin).toBeTruthy();

      });

  }));

});
