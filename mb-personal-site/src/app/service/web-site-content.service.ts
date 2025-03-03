import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Career } from '../models/site-content/Career';
import { Education } from '../models/site-content/Education';
import { PersonalInformation } from '../models/site-content/PersonalInformation';
import { Position } from '../models/site-content/Position';
import { Project } from '../models/site-content/Project';
import { TechnicalKnowledge } from '../models/site-content/TechnicalKnowledge';
import { WebsiteContent } from '../models/site-content/WebsiteContent';

@Injectable({
  providedIn: 'root'
})
export class WebSiteContentService {

  constructor(private http: HttpClient) { }

  get(): Observable<WebsiteContent> {
    return this.http
      .get('/assets/config/content.json')
      .pipe(map((data: any) => { return this.getWebsiteContentFromConfiguration(data); }));
  }

  private getWebsiteContentFromConfiguration(configuration: any): WebsiteContent {
    return new WebsiteContent(
      {
        personalInformation: new PersonalInformation(configuration.personalInformation),
        education: this.getEducationFromConfiguration(configuration.education),
        personalInterests: configuration.personalInterests,
        technicalKnowledge: this.getTechnicalKnowledgeFromConfiguration(configuration.technicalKnowledge),
        careerInformation: this.getCareerInformationFromConfiguration(configuration.careerInformation)
      }
    );
  }
  private getEducationFromConfiguration(configuration: any): import("../models/site-content/Education").Education[] {
    const education: Education[] = [];

    configuration.forEach(educationItem => {
      education.push(new Education(educationItem));
    });

    return education;    
  }

  private getCareerInformationFromConfiguration(configuration: any): Career[] {
    const careerInformation: Career[] = [];    

    configuration.forEach(career => {
      career.positions = this.getPositionsFromConfiguration(career.positions);
      career.projects = this.getProjectsFromConfiguration(career.projects);
      careerInformation.push(new Career(career));      
    });

    return careerInformation;
  }

  private getProjectsFromConfiguration(configuration: any): any {
    const projects: Project[] = [];

    configuration.forEach(project => {
      projects.push(new Project(project));
    });

    return projects;    
  }

  private getPositionsFromConfiguration(configuration: any): any {
    const positions: Position[] = [];

    configuration.forEach(position => {
      positions.push(new Position(position));
    });

    return positions;    
  }

  private getTechnicalKnowledgeFromConfiguration(configuration: any): TechnicalKnowledge[] {
    const technicalKnowledge: TechnicalKnowledge[] = [];

    configuration.forEach((knowledge: any) => {
      technicalKnowledge.push(new TechnicalKnowledge(knowledge));
    });

    return technicalKnowledge;
  }
}
