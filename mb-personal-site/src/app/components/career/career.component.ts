import { Component, OnInit } from '@angular/core';
import { Career } from 'src/app/models/Career';
import { WebsiteContent } from 'src/app/models/WebsiteContent';
import { WebSiteContentService } from 'src/app/service/web-site-content.service';

@Component({
  selector: 'app-career',
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.sass']
})
export class CareerComponent implements OnInit {

  websiteContent: WebsiteContent;

  constructor(private websiteContentService: WebSiteContentService) { }

  ngOnInit(): void {
    this.websiteContentService.get().subscribe(
      (content: WebsiteContent) => {        
        this.websiteContent = content;
      },
      (error) => {
        console.error("Error while getting website content: ", error);
      }
    );
  }

  getFormattedCareerPeriod(career: Career): string {
    return career.endDate.isValid() ? '(' + career.startDate?.format("YYYY") + ' - ' + career.endDate?.format("YYYY") + ')' : '(Current)';
  }

}
