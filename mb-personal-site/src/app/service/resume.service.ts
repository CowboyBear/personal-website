import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Resume } from '../models/Resume';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { WebSiteContentService } from './web-site-content.service';
import { WebsiteContent } from '../models/WebsiteContent';

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
    return new Resume({
      personalInformation: websiteContent.personalInformation,
      education: websiteContent.education,
      resumeData: resumeData
    });
  }

}
