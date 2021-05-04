import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PersonalInformation } from '../models/PersonalInformation';
import { TechnicalKnowledge } from '../models/TechnicalKnowledge';
import { WebsiteContent } from '../models/WebsiteContent';

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
        personalInformation: this.getPersonalInformationFromConfiguration(configuration.personalInformation),
        personalInterests: configuration.personalInterests,
        technicalKnowledge: this.getTechnicalKnowledgeFromConfiguration(configuration.technicalKnowledge)
      }
    );
  }

  private getTechnicalKnowledgeFromConfiguration(configuration: any): TechnicalKnowledge[] {
    const technicalKnowledge: TechnicalKnowledge[] = [];

    configuration.forEach((knowledge: any) => {
      technicalKnowledge.push(
        new TechnicalKnowledge({
          title: knowledge.title,
          description: knowledge.description,
          emblemSrc: knowledge.emblemSrc
        })
      );
    });

    return technicalKnowledge;
  }

  private getPersonalInformationFromConfiguration(configuration: any): PersonalInformation {
    return new PersonalInformation(
      {
        profilePictureSrc: configuration.profilePictureSrc,
        name: configuration.name,
        email: configuration.email,
        dateOfBirth: configuration.dateOfBirth,
        nationality: configuration.nationality,
        biography: configuration.biography        
      }
    );
  }
}
