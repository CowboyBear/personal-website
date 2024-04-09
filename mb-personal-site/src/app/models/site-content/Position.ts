import * as moment from "moment";

export class Position {

  public title: string;
  public startDate: moment.Moment;
  public endDate: moment.Moment;
  public description: string;
  public resumeDescription: string;


  public constructor(
    fields?: {
      title?: string,
      startDate?: string,
      endDate?: string,
      description?: string,
      resumeDescription?: string
    }
  ) {
    if (fields) {
      this.title = fields.title || this.title;
      this.startDate = moment(fields.startDate) || this.startDate;
      this.endDate = moment(fields.endDate) || this.endDate;
      this.description = fields.description || this.description;
      this.resumeDescription = fields.resumeDescription || this.description;
    }
  }

}