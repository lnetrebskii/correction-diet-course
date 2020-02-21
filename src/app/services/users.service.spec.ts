import { TestBed } from '@angular/core/testing';
import { UsersService } from './users.service';

fdescribe('UsersService', () => {
  beforeEach(() => {

    const { mockFirebase } = require('firestore-jest-mock');
    // Create a fake firestore with a `users` and `posts` collection
    mockFirebase({
      database: {
        users: [
          { id: 'abc123', name: 'Homer Simpson' },
          { id: 'abc456', name: 'Lisa Simpson' },
        ],
        posts: [{ id: '123abc', title: 'Really cool title' }],
      },
    });

    TestBed.configureTestingModule({
      imports: []
    });

  });

  fit('mock-firebase', () => {
    const firebase = require('firebase'); // or import firebase from 'firebase';
    const db = firebase.firestore();

    db.collection('users')
      .get()
      .then(userDocs => {
        // write assertions here
      });
  });

  it('should be created', () => {
    const service: UsersService = TestBed.get(UsersService);
    expect(service).toBeTruthy();
  });
});
