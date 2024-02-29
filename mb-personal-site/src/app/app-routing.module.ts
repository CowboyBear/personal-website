import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutMeComponent } from './components/about-me/about-me.component';
import { CareerDetailComponent } from './components/career/career-detail/career-detail.component';
import { CareerComponent } from './components/career/career.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ResumeComponent } from './components/resume/resume.component';

const routes: Routes = [
  { path: 'about', component: AboutMeComponent },
  { path: 'career', component: CareerComponent },
  { path: 'career/:index', component: CareerDetailComponent },
  { path: 'page-not-found', component: NotFoundComponent},  
  { path: 'resume', component: ResumeComponent },
  { path: '', redirectTo: '/about', pathMatch: 'full' },
  { path: '**',redirectTo: '/page-not-found', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
