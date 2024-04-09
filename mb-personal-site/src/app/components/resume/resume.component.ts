import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PDFResumeBuilder } from 'src/app/models/resume/PDFResumeBuilder';
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

  public resumeUrl: SafeResourceUrl;
  public localPdfUrl: string;
  
  constructor(private resumeService: ResumeService, private sanitizer: DomSanitizer) {
    resumeService.get().subscribe(
      resume => {
        const blob: Blob = new PDFResumeBuilder(resume)
          .withSideBar()
          .withHeader()
          .withSummary()
          .withProfessionalExperience()
          .withEducation()
          .build();

        this.localPdfUrl = URL.createObjectURL(blob);        

        this.resumeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.localPdfUrl);
      }, 
      error=> {
        console.log('Error while getting resume information: ', error);
      }
    );
  }   

  public downloadPDF_OnClick(): void {    
    var a = document.createElement("a");
    document.body.appendChild(a);    
    a.href = this.localPdfUrl;
    a.download = 'resume.pdf';
    a.click();
    
    setTimeout(() => {      
      document.body.removeChild(a);
    }, 0);
  }

}
