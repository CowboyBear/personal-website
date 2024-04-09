import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { WebsiteContent } from './models/site-content/WebsiteContent';
import { WebSiteContentService } from './service/web-site-content.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {  
  @ViewChild("drawer") drawer: MatDrawer;
  websiteContent: WebsiteContent;

  constructor(private websiteContentService: WebSiteContentService) { }

  ngAfterViewInit(): void {        
  }

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
}
