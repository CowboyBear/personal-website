import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Education } from 'src/app/models/site-content/Education';
import { WebsiteContent } from 'src/app/models/site-content/WebsiteContent';
import { WebSiteContentService } from 'src/app/service/web-site-content.service';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.sass']
})
export class AboutMeComponent implements OnInit {  
  dateOfBirth: string;
  firstName: string;
  myAge: number;  
  websiteContent: WebsiteContent;

  constructor(private websiteContentService: WebSiteContentService) { }

  ngOnInit(): void {

    this.websiteContentService.get().subscribe(
      (content: WebsiteContent) => {           
        this.websiteContent = content;        
        this.dateOfBirth = content.personalInformation.dateOfBirth.format("MMM Do, yyyy");
        this.myAge = moment().diff(content.personalInformation.dateOfBirth, 'years');
        this.firstName = content.personalInformation.name.split(' ')[0];
      },
      (error) => {
        console.error("Error while getting website content: ", error);
      }
    );    
  }

  public getFormattedEducationPeriod(education: Education): string {
    const shouldFormat: boolean = education.startDate.isValid() && education.endDate.isValid();

    return shouldFormat ? education.startDate.format('YYYY') + ' - ' + education.endDate.format('YYYY')  : "";

  }
}
