import {convertToMoment, convertToTimestamp} from "./db-utils";
import Timestamp = firebase.firestore.Timestamp;
import * as firebase from 'firebase';
import * as moment from "moment";

describe('db-utils', () => {

  it('should convert timestamp to moment', () => {
    const oneDaySeconds = 60 * 60 * 24;
    const ts = new Timestamp(oneDaySeconds, 0);

    const m = convertToMoment(ts);

    expect(m).toEqual(moment(oneDaySeconds * 1000));
  });

  it('should convert moment to timestamp', () => {
    const oneDaySeconds = 60 * 60 * 24;
    const ts = moment(oneDaySeconds * 1000);

    const m = convertToTimestamp(ts);

    expect(m).toEqual(new Timestamp(oneDaySeconds, 0));
  });

});
