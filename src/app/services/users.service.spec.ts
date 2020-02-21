import { TestBed } from '@angular/core/testing';
import { UsersService } from './users.service';
import {AngularFirestore, AngularFirestoreDocument, DocumentData, DocumentSnapshot} from "@angular/fire/firestore";
import {of} from "rxjs";

describe('UsersService', () => {

  let firestoreSpy: any;

  function setReturnIdAndData(id: string, data: any) {
    firestoreSpy.doc.and.callFake(function (docId) {
      return {
        get: () => {
          return of({
            id: id,
            data: () => {
              return data;
            }
          })
        }
      };
    });
  }

  beforeEach(() => {

    firestoreSpy = jasmine.createSpyObj('AngularFirestore', ['doc']);

    TestBed.configureTestingModule({
      providers: [
        UsersService,
        { provide: AngularFirestore, useValue: firestoreSpy }
      ]
    });

    setReturnIdAndData("1", { isAdmin: true });

  });

  it('should return DietUser instance', () => {

    const service: UsersService = TestBed.get(UsersService);

    service.get("1").subscribe( user => {
      expect(user.id).toBeTruthy();
      expect(user.isAdmin).toBeTruthy();
    });

  });

  it('should call doc once with document id', () => {

    const service: UsersService = TestBed.get(UsersService);

    service.get("1").subscribe( user => {
      expect(firestoreSpy.doc).toHaveBeenCalledTimes(1);
      expect(firestoreSpy.doc).toHaveBeenCalledWith("users/1");
    });

  });
});
