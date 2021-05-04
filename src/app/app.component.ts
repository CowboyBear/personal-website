import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { WebsiteContent } from './models/WebsiteContent';
import { WebSiteContentService } from './service/web-site-content.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {  
  @ViewChild("drawer") drawer: MatDrawer;
  websiteContent: WebsiteContent;

  ngAfterViewInit(): void {    
    // this.drawer.open();
  }
}
