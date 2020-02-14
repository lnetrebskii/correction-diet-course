import {Moment} from "moment";
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;
import * as moment from "moment";

export function convertSnaps<T>(snaps) {
  return <T[]>snaps.map(snap => {
    return {
      id: snap.payload.doc.id,
      ...snap.payload.doc.data()
    };
  });
}

export function convertToMoment(t: Timestamp): Moment {
  return t ? moment(t.toMillis()) : undefined;
}

export function convertToTimestamp(m: Moment): Timestamp {
  return m ? Timestamp.fromDate(m.toDate()) : undefined;
}
