import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Resume } from '../models/Resume';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { WebSiteContentService } from './web-site-content.service';
import { WebsiteContent } from '../models/WebsiteContent';
import { Position } from '../models/Position';
import { Career } from '../models/Career';
import { ProfessionalExperience } from '../models/ProfessionalExperience';
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  constructor(private http: HttpClient, private websiteContentService: WebSiteContentService) { }

  public get(): Observable<Resume> {
    const websiteContent: Observable<WebsiteContent> = this.websiteContentService.get();
    const resumeContent: Observable<any> = this.http.get('/assets/config/resume.json');

    return forkJoin<WebsiteContent, any>([websiteContent, resumeContent])
      .pipe(
        map((data: any) => {
          return this.getResumeContentFromConfiguration(data[0], data[1]);
        })
      );
  }

  private getResumeContentFromConfiguration(websiteContent: WebsiteContent, resumeData: any): Resume {

    resumeData.professionalExperiences = this.getProfessionalExperience(websiteContent);
    
    return new Resume({
      personalInformation: websiteContent.personalInformation,
      education: websiteContent.education,
      resumeData: resumeData      
    });
  }

  private getProfessionalExperience(websiteContent: WebsiteContent): ProfessionalExperience[] {
    let professionalExperiences: ProfessionalExperience[] = [];

    websiteContent.careerInformation.forEach((career: Career) => {
      let experience: ProfessionalExperience = new ProfessionalExperience({
        company: career.company,
        positions: career.positions
      });

      experience.positions.sort((a, b) => { 
        return this.dateDescendingComparator(a.startDate, b.startDate);
      });

      professionalExperiences.push(experience);
    });  
    
    return professionalExperiences.sort((a, b) => { 
      return this.dateDescendingComparator(a.positions[0].startDate, b.positions[1].startDate);
    });
  }

  private dateDescendingComparator(a: moment.Moment, b: moment.Moment): number {
    return a.isAfter(b) ? -1 : 1;
  }
}
