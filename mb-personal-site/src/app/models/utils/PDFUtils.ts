import { PDFComponentRenderer } from "../resume/component-renderers/PDFComponentRenderer";
import { Dimensions } from "./Dimensions";
import { PDFConstants } from "./PDFConstants";
import { PDFDocument } from "./PDFDocument";
import { PDFSideBarUtils } from "./PDFSideBarUtils";

export class PDFUtils {
    public sideBar: PDFSideBarUtils;
    
    private pdf: PDFDocument;    

    constructor(pdf: PDFDocument) {
        this.pdf = pdf;             
        this.sideBar = new PDFSideBarUtils(pdf);
    }
    
    public writeHeader(text: string): void {
        this.pdf.setFontSize(28);
        this.writeText(text);
    }
    
    public writeSubHeader(text: string): void {
        this.pdf.setFontSize(16);
        this.writeText(text);
    }  
    
    public writeHighlightedSubtitle(text: string): void {
        const SUBTITLE_TEXT_COLOR = '#1ab0b3';
        this.pdf.doc.setTextColor(SUBTITLE_TEXT_COLOR);
        this.pdf.setFontSize(14);
        this.writeText(text);        
    }

    public writeDefaultText(text: string, alignRight?: boolean) {
        this.pdf.doc.setTextColor(PDFConstants.TEXT_COLOR);
        this.pdf.setFontSize(12);
        this.writeText(text, alignRight);
    }   

    public addLineBreak(lineHeight?: number): void {        
        const DEFAULT_LINE_HEIGHT: number = 13;
        this.pdf.moveTo(
            PDFConstants.LINE_START,
            this.pdf.cursorYCoordinate + (lineHeight ? lineHeight : DEFAULT_LINE_HEIGHT)
        );        
    }   

    public writeText(text: string, alignRight?: boolean): void {               
        this.pdf.doc.text(
            text,
            this.pdf.cursorXCoordinate,
            this.pdf.cursorYCoordinate,
            {
                maxWidth: PDFConstants.MAX_TEXT_WIDTH,
                align: alignRight ? 'right' : "left"
            }
        );
    }   
    
    public getTextDimensions(text: string): Dimensions {
        const {w, h} = this.pdf.doc.getTextDimensions(
            text,
            {
                fontSize: this.pdf.doc.getFontSize(),
                maxWidth: PDFConstants.MAX_TEXT_WIDTH
            }
        );

        return new Dimensions(w, h);
    }

    public renderSectionSeparator(sectionName: string): void {
        this.writeSubHeader(sectionName);
        this.pdf.moveTo(
            this.pdf.cursorXCoordinate, 
            this.pdf.cursorYCoordinate + 5
        );
        
        this.renderLineSeparator();

        this.addLineBreak();
    }

    public simulateTextDimensions(text: string, fontSize: number): Dimensions {
        let oldFontSize: number = this.pdf.doc.getFontSize();
        
        this.pdf.setFontSize(fontSize);        
        const textDimensions = this.getTextDimensions(text);        
        this.pdf.setFontSize(oldFontSize);

        return textDimensions;
    }

    public renderTitleWithPeriodComponent(title: string, startDate: moment.Moment, endDate: moment.Moment) : void {
        const period: string = `${this.formatDate(startDate)} - ${this.formatDate(endDate)}`;
        
        this.pdf.doc.setTextColor(PDFConstants.TEXT_COLOR);
        this.writeSubHeader(title);

        this.pdf.moveTo(PDFConstants.LINE_END, this.pdf.cursorYCoordinate);

        this.writeDefaultText(period, true);
        
        this.pdf.moveTo(PDFConstants.LINE_START, this.pdf.cursorYCoordinate);
        this.addLineBreak(this.getTextDimensions(period).height + 5);
    }

    public handlePageBreak(componentHeight: number) : void{
        const shouldAddPageBreak: boolean = this.pdf.cursorYCoordinate + componentHeight > PDFConstants.PAGE_HEIGHT;

        if (shouldAddPageBreak) {
            this.addPageBreak();
        }
    }

    public renderSideBarBackground(): void {
        this.pdf.doc.setFillColor(PDFConstants.SIDE_BAR.BACKGROUND_COLOR);
        this.pdf.doc.rect(0, 0, PDFConstants.SIDE_BAR.WIDTH, PDFConstants.PAGE_HEIGHT, 'F');
    }

    public renderSidebarFirstPageShadow(): void {
        const SHADOW_COLOR = '#004747';
        this.pdf.doc.setFillColor(SHADOW_COLOR);
        this.pdf.doc.rect(0, 0, PDFConstants.SIDE_BAR.WIDTH, PDFConstants.PAGE_HEIGHT * 0.004, 'F');
    }

    public renderSimpleComponent(renderer: PDFComponentRenderer<any>, target: any): void {
        renderer.setTarget(target);
        renderer.render();
    }

    // TODO: Deal with possible pagination
    public renderSection(title: string, renderer: PDFComponentRenderer<any>, list: any[]): void {

        this.renderSectionSeparator(title);

        list.forEach((obj: any) => {
            renderer.setTarget(obj);
            renderer.render();
        });

        this.addLineBreak();
    }    

    private addPageBreak(): void {
        this.pdf.doc.addPage();
        this.renderSideBarBackground();
        this.pdf.moveTo(PDFConstants.LINE_START, PDFConstants.VERTICAL_PADDING);        
    }    

    private formatDate(date: moment.Moment): string {        
        return date.isValid() ? date.format('YYYY') : 'Present';
    }    

    private renderLineSeparator(): void {
        this.pdf.doc.setFillColor('#bdbdbd');        

        this.pdf.doc.line(
            this.pdf.cursorXCoordinate,
            this.pdf.cursorYCoordinate,
            this.pdf.cursorXCoordinate + PDFConstants.MAX_TEXT_WIDTH,
            this.pdf.cursorYCoordinate,
            'F'
        );
    }    

}