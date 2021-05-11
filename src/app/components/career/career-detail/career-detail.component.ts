import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Career } from 'src/app/models/Career';
import { Position } from 'src/app/models/Position';
import { WebsiteContent } from 'src/app/models/WebsiteContent';
import { WebSiteContentService } from 'src/app/service/web-site-content.service';

@Component({
  selector: 'app-career-detail',
  templateUrl: './career-detail.component.html',
  styleUrls: ['./career-detail.component.sass']
})
export class CareerDetailComponent implements OnInit {
    
  public careerDetail: Career;
  public nextCompanyLink:string;
  public previousCompanyLink:string;

  constructor(private route: ActivatedRoute, private router: Router, private websiteContentService: WebSiteContentService) { }

  ngOnInit(): void {
    const currentCompanyIndexString: string = this.route.snapshot.paramMap.get('index')
    const currentCompanyIndex: number = parseInt(currentCompanyIndexString);    
    const nextCompanyIndex = currentCompanyIndex + 1;
    const previousCompanyIndex = currentCompanyIndex - 1;

    this.websiteContentService.get().subscribe(
      (content: WebsiteContent) => {
        this.careerDetail = content.careerInformation[currentCompanyIndex];        
        this.nextCompanyLink = this.getCompanyLinkByIndex(content, nextCompanyIndex);
        this.previousCompanyLink = this.getCompanyLinkByIndex(content, previousCompanyIndex);

        if (!this.careerDetail) {          
          this.router.navigate(['page-not-found'])               
        }        
      },
      (error) => {
        console.error("Error while getting website content: ", error);
      }
    );
  }

  private getCompanyLinkByIndex(content: WebsiteContent, nextCompanyIndex: number): string {
    return content.careerInformation[nextCompanyIndex] ? '/career/' + (nextCompanyIndex) : undefined;
  }

  public getFormattedPositionPeriod(position: Position): string {
    const shouldFormat: boolean = position.startDate.isValid() && position.endDate.isValid();
    return shouldFormat ? '(' + position.startDate.format('MMM/YYYY') + ' to ' + position.endDate.format('MMM/YYYY') + ')' : '';    
  }

}
