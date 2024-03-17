import { jsPDF } from "jspdf";
import { Resume } from "./Resume";
import { Position } from "../site-content/Position";
import { ProfessionalExperience } from "./ProfessionalExperience";
import * as moment from "moment";
import { Education } from "../site-content/Education";
import { ProfileImageRenderer } from "./component-renderers/side-bar/ProfileImageRenderer";
import { PDFDocument } from "../utils/PDFDocument";
import { AchievementRenderer } from "./component-renderers/side-bar/AchievementRenderer";
import { PDFUtils } from "../utils/PDFUtils";
import { SkillRenderer } from "./component-renderers/side-bar/SkillRenderer";
import { LanguageRenderer } from "./component-renderers/side-bar/LanguageRenderer";
import { PDFConstants } from "../utils/PDFConstants";
import { PDFComponentRenderer } from "./component-renderers/PDFComponentRenderer";
import { HeaderRenderer } from "./component-renderers/main-content/HeaderRenderer";
import { SummaryRenderer } from "./component-renderers/main-content/SummaryRenderer";

export class PDFResumeBuilder {
    private resume: Resume;
    private doc: jsPDF;
    private cursorXCoordinate: number;
    private cursorYCoordinate: number;

    private pdf: PDFDocument;
    private utils: PDFUtils;

    private readonly PAGE_HEIGHT: number = 632;
    private readonly PAGE_WIDTH: number = 447;
    private readonly SIDE_BAR_WIDTH: number = this.PAGE_WIDTH * 0.35;
    private readonly HORIZONTAL_PADDING: number = 20;
    private readonly VERTICAL_PADDING: number = 30;
    private readonly FONT_SIZE_SCALE: number = 0.571;

    private readonly DEFAULT_TEXT_COLOR = '#384347';
    private readonly MAX_TEXT_WIDTH = this.PAGE_WIDTH - (this.SIDE_BAR_WIDTH + this.HORIZONTAL_PADDING * 2);
    private readonly LINE_END = this.PAGE_WIDTH - this.HORIZONTAL_PADDING;
    private readonly LINE_START = this.SIDE_BAR_WIDTH + this.HORIZONTAL_PADDING;

    constructor(resume: Resume) {
        this.resume = resume;
        this.doc = new jsPDF({ unit: 'px' });
        this.cursorXCoordinate = 0;
        this.cursorYCoordinate = 0;    
        
        this.pdf = new PDFDocument(this.doc, this.cursorXCoordinate, this.cursorYCoordinate); 
        this.utils = new PDFUtils(this.pdf);   
    };    

    // TODO: Projects (?)
    public withSideBar(): PDFResumeBuilder {
        this.renderSideBarBackground();
        this.renderSidebarFirstPageShadow();
                
        this.renderProfileImage();

        this.renderPDFComponent(
            'ACHIEVEMENTS', 
            new AchievementRenderer(this.utils), 
            this.resume.achievements
        );

        this.renderPDFComponent(
            'PROFESSIONAL EXPERTISE', 
            new SkillRenderer(this.pdf, this.utils), 
            this.resume.skills
        );

        this.renderPDFComponent(
            'LANGUAGES', 
            new LanguageRenderer(this.utils), 
            this.resume.languages
        );        
        
        return this;
    }    

    public withHeader(): PDFResumeBuilder {
        const renderer: HeaderRenderer = new HeaderRenderer(this.pdf, this.utils);
        renderer.setTarget(this.resume.personalInformation);
        renderer.render();

        return this;
    }

    public withSummary(): PDFResumeBuilder {
        const renderer: SummaryRenderer = new SummaryRenderer(this.pdf, this.utils);
        renderer.setTarget(this.resume.summary);
        renderer.render();        

        return this;
    }

    // TODO: This method (and probably all other public methods as well) should be it's own class
    // TODO: Maybe, revert the order of titles: First list the company, then the positions
    public withProfessionalExperience(): PDFResumeBuilder {
        this.renderSectionSeparator('PROFESSIONAL EXPERIENCE');
        
        this.resume.professionalExperiences.forEach((experience : ProfessionalExperience) => {            
            this.renderProfessionalExperienceComponent(experience);            
        });

        this.addLineBreak();        

        return this;
    }

    public withEducation(): PDFResumeBuilder {
        this.renderSectionSeparator('EDUCATION');
        
        this.resume.education.forEach((education : Education) => {            
            this.renderTitleWithPeriodComponent(education.description, education.startDate, education.endDate);        
            this.writeHighlightedSubtitle(education.name);
            this.addLineBreak(this.getTextDimensions(education.name).h + 10);
        });

        this.addLineBreak();        

        return this;
    }    

    private renderProfessionalExperienceComponent(experience: ProfessionalExperience) : void {
        experience.positions.forEach((position: Position) => {            
            const componentHeight: number = this.getProfessionalExperienceComponentHeight(position, experience);
            this.handlePageBreak(componentHeight);

            this.renderTitleWithPeriodComponent(position.title, position.startDate, position.endDate);            

            this.writeHighlightedSubtitle(experience.company);            
            this.addLineBreak(this.getTextDimensions(experience.company).h + 2);

            this.writeDefaultText(position.description);
            this.cursorYCoordinate += this.getTextDimensions(position.description).h;
            this.addLineBreak(10);
        });
    }

    private renderTitleWithPeriodComponent(title: string, startDate: moment.Moment, endDate: moment.Moment) : void {
        const period: string = `${this.formatDate(startDate)} - ${this.formatDate(endDate)}`;
        
        this.doc.setTextColor(this.DEFAULT_TEXT_COLOR);
        this.writeSubHeader(title);

        this.cursorXCoordinate = this.LINE_END;
        this.writeDefaultText(period, true);

        this.cursorXCoordinate = this.LINE_START;
        this.addLineBreak(this.getTextDimensions(period).h + 5);
    }

    private handlePageBreak(componentHeight: number) : void{
        const shouldAddPageBreak: boolean = this.cursorYCoordinate + componentHeight > this.PAGE_HEIGHT;

        if (shouldAddPageBreak) {
            this.addPageBreak();
        }
    }

    private addPageBreak() {
        this.doc.addPage();
        this.renderSideBarBackground();
        this.cursorXCoordinate = this.LINE_START;
        this.cursorYCoordinate = this.VERTICAL_PADDING;
    }

    private getProfessionalExperienceComponentHeight(position: Position, experience: ProfessionalExperience) : number {
        let componentHeight: number = 0;

        componentHeight = this.simulateTextHeight(position.title, 16, 5);
        componentHeight += this.simulateTextHeight(experience.company, 14, 2);
        componentHeight += this.simulateTextHeight(position.description, 12, 5);
            
        return componentHeight;
    }

    private simulateTextHeight(text: string, fontSize: number, verticalPadding?: number) {
        let oldFontSize: number = this.doc.getFontSize();
        
        this.setFontSize(fontSize);
        const textHeight = this.getTextDimensions(text).h;

        this.doc.setFontSize(oldFontSize);

        return verticalPadding ? textHeight + verticalPadding : textHeight;
    }

    private formatDate(date: moment.Moment) {        
        return date.isValid() ? date.format('YYYY') : 'Present';
    }

    public build(): Blob {
        return this.doc.output('blob');
    }    

    private renderSectionSeparator(sectionName: string): void {
        this.writeSubHeader(sectionName);
        this.cursorYCoordinate += 5;
        this.renderLineSeparator();

        this.addLineBreak();
    }

    private renderLineSeparator() {
        this.doc.setFillColor('#bdbdbd');

        this.doc.line(
            this.cursorXCoordinate,
            this.cursorYCoordinate,
            this.cursorXCoordinate + this.MAX_TEXT_WIDTH,
            this.cursorYCoordinate,
            'F'
        );
    }

    private getTextDimensions(text: string): { w: number; h: number } {
        return this.doc.getTextDimensions(
            text,
            {
                fontSize: this.doc.getFontSize(),
                maxWidth: this.MAX_TEXT_WIDTH
            }
        );
    }   

    private addLineBreak(lineHeight?: number): void {
        const DEFAULT_LINE_HEIGHT: number = 13;
        this.cursorYCoordinate += lineHeight ? lineHeight : DEFAULT_LINE_HEIGHT;
        this.cursorXCoordinate = this.LINE_START;
    }    

    private writeSubHeader(text: string): void {
        this.setFontSize(16);
        this.writeText(text);
    }   

    private writeHighlightedSubtitle(text: string): void {
        const SUBTITLE_TEXT_COLOR = '#1ab0b3';
        this.doc.setTextColor(SUBTITLE_TEXT_COLOR);
        this.setFontSize(14);
        this.writeText(text);        
    }

    private writeDefaultText(text: string, alignRight?: boolean) {
        this.doc.setTextColor(this.DEFAULT_TEXT_COLOR);
        this.setFontSize(12);
        this.writeText(text, alignRight);
    }    

    private writeText(text: string, alignRight?: boolean): void {               
        this.doc.text(
            text,
            this.cursorXCoordinate,
            this.cursorYCoordinate,
            {
                maxWidth: this.MAX_TEXT_WIDTH,
                align: alignRight ? 'right' : "left"
            }
        );
    }    

    private setFontSize(size: number): void {
        this.doc.setFontSize(size * this.FONT_SIZE_SCALE);
    }       

    private renderSidebarFirstPageShadow(): void {
        const SHADOW_COLOR = '#004747';
        this.doc.setFillColor(SHADOW_COLOR);
        this.doc.rect(0, 0, PDFConstants.SIDE_BAR.WIDTH, PDFConstants.PAGE_HEIGHT * 0.004, 'F');
    }

    private renderSideBarBackground(): void {
        this.doc.setFillColor(PDFConstants.SIDE_BAR.BACKGROUND_COLOR);
        this.doc.rect(0, 0, PDFConstants.SIDE_BAR.WIDTH, PDFConstants.PAGE_HEIGHT, 'F');
    }

    // TODO: Deal with possible pagination
    private renderPDFComponent(title: string, renderer: PDFComponentRenderer<any>, list: any[]): void {        
        this.utils.sideBar.renderSectionSeparator(title);
        
        list.forEach((obj: any) => {
            renderer.setTarget(obj);
            renderer.render();
        });

        this.utils.sideBar.addLineBreak();
    }

    private renderProfileImage() {
        const renderer: ProfileImageRenderer = new ProfileImageRenderer(this.pdf, this.utils);
        renderer.setTarget('../../assets/img/profile-picture.jpeg');
        renderer.render();
    }
    
}
