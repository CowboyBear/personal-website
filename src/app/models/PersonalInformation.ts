import * as moment from 'moment';

export class PersonalInformation {

  public profilePictureSrc: string;
  public name: string;
  public email: string;
  public dateOfBirth: moment.Moment;
  public nationality: string;
  public biography: string;

  public constructor(
    fields?: {
      profilePictureSrc?: string,
      name?: string,
      email?: string,
      dateOfBirth?: string,
      nationality?: string,
      biography?: string
    }
  ) {
    if (fields) {
      this.profilePictureSrc = fields.profilePictureSrc || this.profilePictureSrc;
      this.name = fields.name || this.name;
      this.email = fields.email || this.email;
      this.dateOfBirth = moment(fields.dateOfBirth) || this.dateOfBirth;      
      this.nationality = fields.nationality || this.nationality;
      this.biography = fields.biography || this.biography;
    }

  }
}