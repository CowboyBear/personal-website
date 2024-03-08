import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PDFResumeBuilder } from 'src/app/models/PDFResumeBuilder';
import { ResumeService } from 'src/app/service/resume.service';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.sass'
})
export class ResumeComponent {  

  public resumeUrl: SafeResourceUrl;// = this.sanitizer.bypassSecurityTrustResourceUrl(window.location.origin);
  
  constructor(private resumeService: ResumeService, private sanitizer: DomSanitizer) {
    resumeService.get().subscribe(
      resume => {
        const blob: Blob = new PDFResumeBuilder(resume)
          .withSideBar()
          .withHeader()
          .withSummary()
          .withProfessionalExperience()
          .build();
          
        const localPdfUrl: string = URL.createObjectURL(blob);        

        this.resumeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(localPdfUrl);
      }, 
      error=> {
        console.log('Error while getting resume information: ', error);
      }
    );
  }   

}
