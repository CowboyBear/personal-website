import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Resume } from '../models/resume/Resume';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { WebSiteContentService } from './web-site-content.service';
import { WebsiteContent } from '../models/site-content/WebsiteContent';
import { Career } from '../models/site-content/Career';
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
    resumeData.achievements = this.getTitleAndDescriptionObjectFromConfiguration(resumeData.achievements);
    resumeData.skills = this.getSkillsFromConfiguration(resumeData)
    resumeData.languages = this.getTitleAndDescriptionObjectFromConfiguration(resumeData.languages);
    
    
    return new Resume({
      personalInformation: websiteContent.personalInformation,
      education: websiteContent.education,
      career: this.getCareerInformation(websiteContent.careerInformation),
      resumeData: resumeData      
    });
  }

  private getCareerInformation(careerInformation: Career[]): Career[] {
    return careerInformation.sort((a, b) => { 
      return a.startDate.isAfter(b.startDate) ? -1 : 1;
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

}
