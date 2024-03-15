import { jsPDF } from "jspdf";
import { Resume } from "./Resume";
import { Position } from "../site-content/Position";
import { ProfessionalExperience } from "./ProfessionalExperience";
import * as moment from "moment";
import { Education } from "../site-content/Education";
import { TitleAndDescriptionPair } from "../utils/TitleAndDescriptionPair";
import { Skill } from "./Skill";

export class PDFResumeBuilder {
    private resume: Resume;
    private doc: jsPDF;
    private cursorXCoordinate: number;
    private cursorYCoordinate: number;

    private readonly PAGE_HEIGHT: number = 632;
    private readonly PAGE_WIDTH: number = 447;
    private readonly SIDE_BAR_WIDTH: number = this.PAGE_WIDTH * 0.35;
    private readonly HORIZONTAL_PADDING: number = 20;
    private readonly VERTICAL_PADDING: number = 30;
    private readonly FONT_SIZE_SCALE: number = 0.571;

    private readonly DEFAULT_TEXT_COLOR = '#384347';
    private readonly MAX_TEXT_WIDTH = this.PAGE_WIDTH - (this.SIDE_BAR_WIDTH + this.HORIZONTAL_PADDING * 2);
    private readonly MAX_SIDE_BAR_TEXT_WIDTH = this.SIDE_BAR_WIDTH - (this.HORIZONTAL_PADDING * 2);
    private readonly LINE_END = this.PAGE_WIDTH - this.HORIZONTAL_PADDING;
    private readonly LINE_START = this.SIDE_BAR_WIDTH + this.HORIZONTAL_PADDING;
    private readonly SIDE_BAR_LINE_START = this.HORIZONTAL_PADDING;

    private readonly SIDE_BAR_DEFAULT_TEXT_COLOR = "#FFFFFF";

    private readonly SKILL_BAR_HEIGHT = 6;
    
    private readonly PROGRESS_BAR_FILL_HEIGHT = this.SKILL_BAR_HEIGHT - 1;
    private readonly PROGRESS_BAR_FILL_MAX_WIDTH = this.MAX_SIDE_BAR_TEXT_WIDTH - 1;
    private readonly PROGRESS_BAR_SPACE_WIDTH = 2;        
    private readonly AMOUNT_OF_RECTS = 10;
    private readonly AMOUNT_OF_SPACES = this.AMOUNT_OF_RECTS - 1;
    private readonly PROGRESS_BAR_FILL_WIDTH = (this.PROGRESS_BAR_FILL_MAX_WIDTH - this.PROGRESS_BAR_SPACE_WIDTH * this.AMOUNT_OF_SPACES)/this.AMOUNT_OF_RECTS;    

    constructor(resume: Resume) {
        this.resume = resume;
        this.doc = new jsPDF({ unit: 'px' });
        this.cursorXCoordinate = 0;
        this.cursorYCoordinate = 0;

        this.setDefaultFont();
    };

    private setDefaultFont() {
        // TODO: CAUSING SHIT TO BREAK. CAN'T GET DIMENSIONS ON CUSTOM FONTS
        // this.doc.addFileToVFS('../../assets/fonts/genera/Genera-AltLight.ttf', 'font');
        // this.doc.addFont('Genera-AltLight.ttf', 'genera-altlight', 'normal');
        // this.doc.setFont('genera-altlight');
    }

    // TODO: Projects (?)
    public withSideBar(): PDFResumeBuilder {
        this.renderSideBarBackground();

        this.renderSidebarFirstPageShadow();

        this.renderProfileImageComponent();        

        this.renderAchievementsComponent();

        this.renderSkillsComponent();        

        this.renderLanguagesComponent();
        
        return this;
    }    

    public withHeader(): PDFResumeBuilder {
        this.cursorXCoordinate = this.LINE_START;
        this.cursorYCoordinate = this.VERTICAL_PADDING;

        this.doc.setTextColor(this.DEFAULT_TEXT_COLOR);
        this.writeHeader(this.resume.personalInformation.name.toUpperCase());

        this.addLineBreak();

        const POSITION_COLOR = '#1ab0b3';
        this.doc.setTextColor(POSITION_COLOR);
        this.writeSubHeader('Application Architect | IT Manager'); // TODO: Add this to the resume config

        this.addLineBreak();

        this.renderPersonalInformationSection([
            this.resume.personalInformation.email,
            this.resume.personalInformation.github,
            'Curitiba, PR', // TODO: Add this to the resume config
            window.location.origin
        ]);

        this.addLineBreak(26);        

        return this;
    }

    public withSummary(): PDFResumeBuilder {
        this.renderSectionSeparator('SUMMARY');

        this.writeDefaultText(this.resume.summary);

        this.cursorYCoordinate += this.getTextDimensions(this.resume.summary).h;
        this.addLineBreak();

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

    private renderPersonalInformationSection(lines: string[]): void {
        const ICON_MARGIN = 7;
        const TAGS_SPACING = 10;
        this.setFontSize(13);
        this.doc.setTextColor(this.DEFAULT_TEXT_COLOR);

        lines.forEach(line => {
            const textDimensions = this.getTextDimensions(line);
            const newXPosition = this.cursorXCoordinate + textDimensions.w + TAGS_SPACING;

            this.breakLineIfRequired(newXPosition + ICON_MARGIN);

            // TODO: Swap @ with the icon 
            this.writeText('@');
            this.cursorXCoordinate += ICON_MARGIN;
            this.writeText(line);

            this.cursorXCoordinate = newXPosition;
        });

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

    private breakLineIfRequired(newXPosition: number) {
        if (newXPosition > (this.PAGE_WIDTH - this.HORIZONTAL_PADDING)) {
            this.addLineBreak();
        }
    }

    private addLineBreak(lineHeight?: number): void {
        const DEFAULT_LINE_HEIGHT: number = 13;
        this.cursorYCoordinate += lineHeight ? lineHeight : DEFAULT_LINE_HEIGHT;
        this.cursorXCoordinate = this.LINE_START;
    }

    private addSideBarLineBreak(lineHeight?: number): void {
        const DEFAULT_LINE_HEIGHT: number = 13;
        this.cursorYCoordinate += lineHeight ? lineHeight : DEFAULT_LINE_HEIGHT;
        this.cursorXCoordinate = this.SIDE_BAR_LINE_START;
    }

    private writeSubHeader(text: string): void {
        this.setFontSize(16);
        this.writeText(text);
    }
    
    private writeSideBarSubHeader(text: string): void {
        this.setFontSize(16);
        this.writeSideBarText(text);
    }

    private writeHighlightedSubtitle(text: string): void {
        const SUBTITLE_TEXT_COLOR = '#1ab0b3';
        this.doc.setTextColor(SUBTITLE_TEXT_COLOR);
        this.setFontSize(14);
        this.writeText(text);        
    }

    private writeHeader(text: string): void {
        this.setFontSize(28);
        this.writeText(text);
    }

    private writeDefaultText(text: string, alignRight?: boolean) {
        this.doc.setTextColor(this.DEFAULT_TEXT_COLOR);
        this.setFontSize(12);
        this.writeText(text, alignRight);
    }

    private writeDefaultSideBarText(text: string, alignRight?: boolean) {
        this.doc.setTextColor(this.SIDE_BAR_DEFAULT_TEXT_COLOR);
        this.setFontSize(12);
        this.writeSideBarText(text, alignRight);
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

    private writeSideBarText(text: string, alignRight?: boolean): void {               
        this.doc.text(
            text,
            this.cursorXCoordinate,
            this.cursorYCoordinate,
            {
                maxWidth: this.MAX_SIDE_BAR_TEXT_WIDTH,
                align: alignRight ? 'right' : "left"
            }
        );
    }

    private setFontSize(size: number): void {
        this.doc.setFontSize(size * this.FONT_SIZE_SCALE);
    }

    private renderAchievementsComponent() {
        this.renderSideBarSectionSeparator('ACHIEVEMENTS');

        this.resume.achievements.forEach((achievement: TitleAndDescriptionPair) => {
            this.writeSideBarSubHeader(achievement.title);
            this.addSideBarLineBreak(this.getTextDimensions(achievement.title).h);
            this.writeDefaultSideBarText(achievement.description);
            this.addSideBarLineBreak(this.getTextDimensions(achievement.description).h);

            this.addSideBarLineBreak();
        });

        this.addSideBarLineBreak();
    }

    private renderSideBarSectionSeparator(sectionName: string): void {
        this.doc.setTextColor(this.SIDE_BAR_DEFAULT_TEXT_COLOR);
        this.writeSubHeader(sectionName);
        this.cursorYCoordinate += 5;
        this.renderSideBarLineSeparator();

        this.addSideBarLineBreak();
    }

    private renderSideBarLineSeparator() {
        this.doc.setFillColor(this.SIDE_BAR_DEFAULT_TEXT_COLOR);

        this.doc.line(
            this.cursorXCoordinate,
            this.cursorYCoordinate,
            this.cursorXCoordinate + this.MAX_SIDE_BAR_TEXT_WIDTH,
            this.cursorYCoordinate,
            'F'
        );
    }

    private renderProfileImageComponent() {
        const PROFILE_IMG_WIDTH = this.SIDE_BAR_WIDTH * 0.4;
        this.cursorXCoordinate = this.SIDE_BAR_WIDTH / 2 - PROFILE_IMG_WIDTH / 2;
        this.cursorYCoordinate = this.VERTICAL_PADDING - this.doc.getLineHeight();;

        this.doc.addImage(
            '../../assets/img/profile-picture.jpeg',
            'JPEG',
            this.cursorXCoordinate,
            this.cursorYCoordinate,
            PROFILE_IMG_WIDTH,
            PROFILE_IMG_WIDTH
        );

        this.addSideBarLineBreak(PROFILE_IMG_WIDTH + 20);        
    }

    private renderSidebarFirstPageShadow() {
        this.doc.setFillColor('#004747');
        this.doc.rect(0, 0, this.SIDE_BAR_WIDTH, this.PAGE_HEIGHT * 0.004, 'F');
    }

    private renderSideBarBackground() {
        this.doc.setFillColor('#046864');
        this.doc.rect(0, 0, this.SIDE_BAR_WIDTH, this.PAGE_HEIGHT, 'F');
    }

    private renderLanguagesComponent() {
        this.renderSideBarSectionSeparator('LANGUAGES');
        
        this.resume.languages.forEach((language: TitleAndDescriptionPair) => {
            const formatted: string = `• ${language.title} (${language.description})`;
            this.writeSideBarSubHeader(formatted);
            this.addSideBarLineBreak(this.getTextDimensions(formatted).h);
            this.addSideBarLineBreak();
        });

        this.addSideBarLineBreak();
    }

    private renderSkillsComponent() {
        this.renderSideBarSectionSeparator('PROFESSIONAL EXPERTISE');

        this.resume.skills.forEach((skill: Skill) => {
            this.writeSideBarSubHeader(skill.name);
            this.addSideBarLineBreak(this.getTextDimensions(skill.name).h);
            this.renderProgressBar(skill.level);
            this.addSideBarLineBreak(this.SKILL_BAR_HEIGHT);
            this.addSideBarLineBreak();
        });

        this.addSideBarLineBreak();
    }

    private renderProgressBar(level: number): void {
        this.renderProgressBarBackground();
        this.renderProgressBarFilling(level);
    }

    private renderProgressBarBackground(): void {
        this.doc.roundedRect(
            this.cursorXCoordinate, 
            this.cursorYCoordinate,
            this.MAX_SIDE_BAR_TEXT_WIDTH,
            this.SKILL_BAR_HEIGHT,
            3,
            3,
            'F'
        );
    }

    private renderProgressBarFilling(level: number) : void {                
        this.cursorYCoordinate += 0.5;
        this.cursorXCoordinate += 0.5;
        let isFirst: boolean = true;
        let initialLevel: number = level;
        
        this.doc.setFillColor('#046864');        

        while(level > 0) {
            if(isFirst) {
                isFirst = false;
                this.drawEdgeProgressIndicator();                                
            } else if(level == 1 && initialLevel == 10) {
                this.drawEdgeProgressIndicator(true);
            } else {
                this.doc.rect(
                    this.cursorXCoordinate, 
                    this.cursorYCoordinate, 
                    this.PROGRESS_BAR_FILL_WIDTH, 
                    this.PROGRESS_BAR_FILL_HEIGHT, 
                    'F'
                );
            }                    

            this.cursorXCoordinate += this.PROGRESS_BAR_SPACE_WIDTH + this.PROGRESS_BAR_FILL_WIDTH;
            level--;
        }       
    }

    private drawEdgeProgressIndicator(right?: boolean) {                
        this.doc.roundedRect(
            this.cursorXCoordinate, 
            this.cursorYCoordinate,
            this.PROGRESS_BAR_FILL_WIDTH,
            this.PROGRESS_BAR_FILL_HEIGHT,
            3,
            3,
            'F'
        );
        
        const HALF_PROGRESS_BAR_FILL_WIDTH = this.PROGRESS_BAR_FILL_WIDTH / 2;
        
        this.doc.rect(
            right ? this.cursorXCoordinate : this.cursorXCoordinate + HALF_PROGRESS_BAR_FILL_WIDTH,
            this.cursorYCoordinate,
            HALF_PROGRESS_BAR_FILL_WIDTH,
            this.PROGRESS_BAR_FILL_HEIGHT,
            'F'
        );
    }
}
