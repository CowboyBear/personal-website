import * as moment from "moment";

export class TitleWithPeriod {
    public title;
    public startDate;
    public endDate;

    constructor(fields: {title: string, startDate: moment.Moment, endDate: moment.Moment}) {
        this.title = fields.title;
        this.startDate = fields.startDate;
        this.endDate = fields.endDate;
    }

}