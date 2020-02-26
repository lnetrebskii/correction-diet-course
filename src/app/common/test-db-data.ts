import * as moment from "moment";
import {Moment} from "moment";
import {Course} from "../model/course";

export const CURRENT_DATE: Moment = moment("2020-01-10").utc(true);

export const COURSES: any = {

  12: {
    id: 12,
    titles: {
      description: 'New Year diet course - Group 1',
      longDescription: 'Intensive course focused on weight loosing after the New Year.'
    },
    iconUrl: 'https://victorysport.ru/content_files/user/img_2017/blog/81/Ava.jpg',
    startsOn: moment("2020-01-01"),
    endsOn: moment("2020-01-10")
  },

  2: {
    id: 2,
    titles: {
      description: 'New Year diet course - Group 1',
      longDescription: 'Intensive course focused on weight loosing after the New Year.'
    },
    iconUrl: 'https://golos.ua/images/items/2019-07/25/iDX9GiFcv0xd5Hcn/img_top.jpg',
    startsOn: moment("2020-01-10"),
    endsOn: moment("2020-01-20"),
  },

  3: {
    id: 3,
    titles: {
      description: 'Summer correction course',
      longDescription: 'Be in shape in summer.'
    },
    iconUrl: 'https://golos.ua/images/items/2019-07/25/iDX9GiFcv0xd5Hcn/img_top.jpg',
    startsOn: moment("2019-07-10"),
    endsOn: moment("2019-07-30"),
  },

  4: {
    id: 4,
    titles: {
      description: 'Spring correction diet course',
      longDescription: 'Be prepared to summer.'
    },
    iconUrl: 'https://u-f.ru/sites/default/files/styles/main_700/public/uploads/s1200_9.jpg?itok=VCRBVqZt',
    startsOn: moment("2021-04-10"),
    endsOn: moment("2021-04-30"),
  }
};

export function setupCourses() : Course[] {
  return (Object.values(COURSES) as Course[])
    .map(course => {
      course.isActive = course.endsOn >= CURRENT_DATE;
      return course;
    });
}
