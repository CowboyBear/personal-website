import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Resume } from '../models/resume/Resume';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { WebSiteContentService } from './web-site-content.service';
import { WebsiteContent } from '../models/site-content/WebsiteContent';
import { Position } from '../models/site-content/Position';
import { Career } from '../models/site-content/Career';
import { ProfessionalExperience } from '../models/resume/ProfessionalExperience';
import * as moment from "moment";
import { TitleAndDescriptionPair } from '../models/utils/TitleAndDescriptionPair';
import { Skill } from '../models/resume/Skill';

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
    resumeData.achievements = this.getTitleAndDescriptionObjectFromConfiguration(resumeData.achievements);
    resumeData.skills = this.getSkillsFromConfiguration(resumeData)
    resumeData.languages = this.getTitleAndDescriptionObjectFromConfiguration(resumeData.languages);
    
    return new Resume({
      personalInformation: websiteContent.personalInformation,
      education: websiteContent.education,
      resumeData: resumeData      
    });
  }

  private getSkillsFromConfiguration(resumeData: any): TitleAndDescriptionPair[] {
    let skills = [];

    resumeData.skills.forEach(skill => {
      skills.push(new Skill(skill));
    });

    return skills;
  }
  
  private getTitleAndDescriptionObjectFromConfiguration(objArray: any[]): TitleAndDescriptionPair[] {
    let results = [];

    objArray.forEach(obj => {
      results.push(new TitleAndDescriptionPair(obj));      
    });

    return results;
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
