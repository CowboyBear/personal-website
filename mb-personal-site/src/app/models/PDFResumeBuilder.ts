import { jsPDF } from "jspdf";
import { Resume } from "./Resume";

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

    public withSideBar(): PDFResumeBuilder {
        this.doc.setFillColor('#046864');
        this.doc.rect(0, 0, this.SIDE_BAR_WIDTH, this.PAGE_HEIGHT, 'F');

        this.doc.setFillColor('#004747');
        this.doc.rect(0, 0, this.SIDE_BAR_WIDTH, this.PAGE_HEIGHT * 0.013, 'F');

        return this;
    }

    public withHeader(): PDFResumeBuilder {
        this.cursorXCoordinate = this.SIDE_BAR_WIDTH + this.HORIZONTAL_PADDING;
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

        this.addLineBreak();
        this.addLineBreak();

        return this;
    }    

    public withSummary(): PDFResumeBuilder {
        this.renderSectionSeparator('SUMMARY');

        this.writeDefaultText(this.resume.summary);        

        this.cursorYCoordinate += this.getTextDimensions(this.resume.summary).h;
        this.addLineBreak();        

        return this;
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

    private renderSectionSeparator(sectionName: string) : void {
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

    private getTextDimensions(text: string) : { w: number; h: number } {
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

    private addLineBreak(lineHeight?: number) : void {
        const DEFAULT_LINE_HEIGHT: number = 13;
        this.cursorYCoordinate += lineHeight? lineHeight : DEFAULT_LINE_HEIGHT;
        this.cursorXCoordinate = this.SIDE_BAR_WIDTH + this.HORIZONTAL_PADDING;
    }   

    private writeSubHeader(text: string) : void {
        this.setFontSize(16);        
        this.writeText(text);
    }

    private writeHeader(text: string) : void {
        this.setFontSize(28);
        this.writeText(text);
    }

    private writeDefaultText(text: string) {
        this.doc.setTextColor(this.DEFAULT_TEXT_COLOR);
        this.setFontSize(12);
        this.writeText(text);
    }

    private writeText(text: string): void {
        this.doc.text(
            text, 
            this.cursorXCoordinate, 
            this.cursorYCoordinate,
            {
                maxWidth: this.MAX_TEXT_WIDTH
            }
        );
    }

    private setFontSize(size: number): void {
        this.doc.setFontSize(size * this.FONT_SIZE_SCALE);
    }
}
