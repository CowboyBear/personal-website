import * as moment from 'moment';
import { Position } from './Position';
import { Project } from './Project';

export class Career {
  public logoSrc: string;
  public company: string;
  public startDate: moment.Moment;
  public endDate: moment.Moment;
  public iconSrc: string;  
  public about: string;
  public positions: Position[];
  public projects: Project[];
  public technologies: string[];

  public constructor(
    fields?: {
      logoSrc?: string,
      company?: string,
      startDate?: string,
      endDate?: string,
      iconSrc?: string,
      about?: string,
      positions?: Position[],
      projects?: Project[],
      technologies?: string[]
    }
  ) {
    if (fields) {
      this.logoSrc = fields.logoSrc || this.logoSrc;
      this.company = fields.company || this.company;
      this.startDate = moment(fields.startDate) || this.startDate;
      this.endDate = moment(fields.endDate) || this.endDate;
      this.iconSrc = fields.iconSrc || this.iconSrc;
      this.about = fields.about || this.about;
      this.positions = fields.positions || this.positions;
      this.projects = fields.projects || this.projects;
      this.technologies = fields.technologies || this.technologies;
    }
  }
}