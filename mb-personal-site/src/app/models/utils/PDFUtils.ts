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

    private renderLineSeparator() {
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