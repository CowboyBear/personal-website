import * as moment from 'moment';

export class Career {

  public company: string;
  public startDate: moment.Moment;
  public endDate: moment.Moment;
  public iconSrc: string;

  public constructor(
    fields?: {
      company?: string,
      startDate?: string,
      endDate?: string,
      iconSrc?: string
    }
  ) {
    if (fields) {
      this.company = fields.company || this.company;
      this.startDate = moment(fields.startDate) || this.startDate;
      this.endDate = moment(fields.endDate) || this.endDate;
      this.iconSrc = fields.iconSrc || this.iconSrc;
    }

  }
}