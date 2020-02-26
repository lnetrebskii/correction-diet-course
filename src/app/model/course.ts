import {Moment} from "moment";

export interface Course {
  url: string;
  startsOn: Moment;
  endsOn: Moment;
  id:string;
  titles: {
    description:string;
    longDescription: string;
  };
  iconUrl: string;
  isActive: boolean;
}
