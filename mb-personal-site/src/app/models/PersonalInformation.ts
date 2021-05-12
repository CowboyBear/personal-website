import * as moment from 'moment';

export class PersonalInformation {

  public profilePictureSrc: string;
  public name: string;
  public email: string;
  public linkedIn: string;
  public github: string;
  public dateOfBirth: moment.Moment;
  public nationality: string;
  public biography: string;

  public constructor(
    fields?: {
      profilePictureSrc?: string,
      name?: string,
      linkedIn?: string,
      github?: string,
      email?: string,
      dateOfBirth?: string,
      nationality?: string,
      biography?: string
    }
  ) {
    if (fields) {
      this.profilePictureSrc = fields.profilePictureSrc || this.profilePictureSrc;
      this.name = fields.name || this.name;
      this.linkedIn = fields.linkedIn || this.linkedIn;
      this.github = fields.github || this.github;
      this.email = fields.email || this.email;
      this.dateOfBirth = moment(fields.dateOfBirth) || this.dateOfBirth;      
      this.nationality = fields.nationality || this.nationality;
      this.biography = fields.biography || this.biography;
    }

  }
}