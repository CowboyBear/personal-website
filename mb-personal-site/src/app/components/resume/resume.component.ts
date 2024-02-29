import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import jsPDF from 'jspdf';
import { Resume } from 'src/app/models/Resume';
import { ResumeService } from 'src/app/service/resume.service';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.sass'
})
export class ResumeComponent {  

  public resumeUrl: SafeResourceUrl;
  
  constructor(private resumeService: ResumeService, private sanitizer: DomSanitizer) {
    resumeService.get().subscribe(
      resume => {
        const blob: Blob = this.generateResume(resume);
        const localPdfUrl: string = URL.createObjectURL(blob);
        this.resumeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(localPdfUrl);
      }, 
      error=> {
        console.log('Error while getting resume information: ', error);
      }
    );
  }

  public generateResume(resume: Resume): Blob {
    const doc: jsPDF = new jsPDF({unit: 'px'});    

    doc.setFontSize(12);
    //position i'm applying for?
    doc.text(resume.personalInformation.name, 10, 10);
    doc.text(resume.personalInformation.email, 10, 30);
    doc.text(resume.personalInformation.linkedIn, 10, 50);
    doc.text(resume.personalInformation.github, 10, 70);
    
    doc.setFontSize(20);
    doc.text('Education', 10, 100);
    doc.line(10, 110, 400, 110);

    doc.setFontSize(12);

    let startY = 130;

    resume.education.forEach(education => {      
      doc.text(education.description, 20, startY);
      doc.text(`${education.startDate.year()}-${education.endDate.year()}`, 430, startY, {align: 'right'});
      startY += 20;
      doc.text(education.name, 20, startY);
      startY += 30;
    });
    


    


    
    return doc.output('blob');    
  }

}
