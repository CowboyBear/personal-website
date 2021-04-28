import { Component, OnInit } from '@angular/core';
import { TechnicalKnowledge } from 'src/app/models/TechnicalKnowledge';
import * as moment from 'moment';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.sass']
})
export class AboutMeComponent implements OnInit {

  
  dateOfBirth: moment.Moment;
  myAge: number;
  technicalStuff: TechnicalKnowledge[] = [];

  constructor() { }

  ngOnInit(): void {
    this.dateOfBirth = moment('1994-10-05');
    this.myAge = moment().diff(this.dateOfBirth, 'years');
    this.technicalStuff = this.getTechnicalStuff();
  }

  getTechnicalStuff(): TechnicalKnowledge[]{
    return [
      new TechnicalKnowledge({
        title: '.NET (C#)',
        description: [
          'blablablablabla',
          'bla blabla blablabla bla blablabla blablablablabla blablablablablabla',
          'blablabla',
        ],
        emblemSrc: 'assets/img/emblems/csharp.svg'
      }),
      new TechnicalKnowledge({
        title: 'HTML5, CSS3, JS...',
        description: [
          'blablablablabla',
          'bla blabla blablabla bla blablabla blablablablabla blablablablablabla',
          'blablabla',
        ],
        emblemSrc: 'assets/img/emblems/html5.svg'
      }),
      new TechnicalKnowledge({
        title: 'Java',
        description: [
          'blablablablabla',
          'bla blabla blablabla bla blablabla blablablablabla blablablablablabla',
          'blablabla',
        ],
        emblemSrc: 'assets/img/emblems/java.svg'
      }),
      new TechnicalKnowledge({
        title: 'Containers & Orchestration',
        description: [
          'blablablablabla',
          'bla blabla blablabla bla blablabla blablablablabla blablablablablabla',
          'blablabla',
        ],
        emblemSrc: 'assets/img/emblems/containers.png'
      }),
      new TechnicalKnowledge({
        title: 'Database Stuff...',
        description: [
          'blablablablabla',
          'bla blabla blablabla bla blablabla blablablablabla blablablablablabla',
          'blablabla',
        ],
        emblemSrc: 'assets/img/emblems/db.png'
      }),
      new TechnicalKnowledge({
        title: 'Cloud Stuff',
        description: [
          'blablablablabla',
          'bla blabla blablabla bla blablabla blablablablabla blablablablablabla',
          'blablabla',
        ],
        emblemSrc: 'assets/img/emblems/cloud.png'
      }),
      new TechnicalKnowledge({
        title: 'Agile software development',
        description: [
          'blablablablabla',
          'bla blabla blablabla bla blablabla blablablablabla blablablablablabla',
          'blablabla',
        ],
        emblemSrc: 'assets/img/emblems/agile.png'
      }),
      new TechnicalKnowledge({
        title: 'Clean code & Best Practices',
        description: [
          'blablablablabla',
          'bla blabla blablabla bla blablabla blablablablabla blablablablablabla',
          'blablabla',
        ],
        emblemSrc: 'assets/img/emblems/cleancode.png'
      })
    ];
  }

}
