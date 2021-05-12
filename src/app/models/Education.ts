import * as moment from "moment";

export class Education{
  public name: string;
  public description: string;
  public startDate: moment.Moment;
  public endDate: moment.Moment;
  public imgSrc: string;

  public constructor(
    fields?:{
      name?: string,
      description?: string,
      startDate?: moment.Moment,
      endDate?: moment.Moment,
      imgSrc?: string
    }
  ){
    if(fields){
      this.name = fields.name || this.name;
      this.description = fields.description || this.description;
      this.startDate = moment(fields.startDate) || this.startDate;
      this.endDate = moment(fields.endDate) || this.endDate;
      this.imgSrc = fields.imgSrc || this.imgSrc;
    }

  }
}