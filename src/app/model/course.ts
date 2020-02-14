import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export interface Course {
  url: string;
  startsOn: Timestamp;
  endsOn: Timestamp;
  id:string;
  titles: {
    description:string;
    longDescription: string;
  };
  iconUrl: string;
}
