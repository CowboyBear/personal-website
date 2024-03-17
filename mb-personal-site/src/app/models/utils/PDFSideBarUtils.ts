import { PDFComponentRenderer } from "../resume/component-renderers/PDFComponentRenderer";
import { Dimensions } from "./Dimensions";
import { PDFConstants } from "./PDFConstants";
import { PDFDocument } from "./PDFDocument";

export class PDFSideBarUtils {
    private pdf: PDFDocument;    

    constructor(pdf: PDFDocument) {
        this.pdf = pdf;              
    }
    
    public addLineBreak(lineHeight?: number): void {                
        this.pdf.moveTo(
            PDFConstants.SIDE_BAR.LINE_START,
            this.pdf.cursorYCoordinate + (lineHeight ?? PDFConstants.DEFAULT_LINE_HEIGHT)
        );        
    }

    public writeSubHeader(text: string): void {
        this.pdf.setFontSize(16);
        this.writeText(text);
    }
    
    public writeDefaultText(text: string, alignRight?: boolean): void {
        this.pdf.doc.setTextColor(PDFConstants.SIDE_BAR.TEXT_COLOR);
        this.pdf.setFontSize(12);
        this.writeText(text, alignRight);
    }

    public renderSectionSeparator(sectionName: string): void {
        this.pdf.doc.setTextColor(PDFConstants.SIDE_BAR.TEXT_COLOR);
        this.writeSubHeader(sectionName);
        this.pdf.moveTo(this.pdf.cursorXCoordinate, this.pdf.cursorYCoordinate + 5);
        this.renderLineSeparator();

        this.addLineBreak();
    }
    
    public getTextDimensions(text: string): Dimensions {
        let {w, h} = this.pdf.doc.getTextDimensions(
            text,
            {
                fontSize: this.pdf.doc.getFontSize(),
                maxWidth: PDFConstants.SIDE_BAR.TEXT_WIDTH
            }
        );

        return new Dimensions(w, h);
    }

    public renderSection(title: string, renderer: PDFComponentRenderer<any>, list: any[]): void {
        this.renderSectionSeparator(title);

        list.forEach((obj: any) => {
            renderer.setTarget(obj);
            renderer.render();
        });

        this.addLineBreak();
    }    

    private writeText(text: string, alignRight?: boolean): void {                                         

        this.pdf.doc.text(
            text,
            this.pdf.cursorXCoordinate,
            this.pdf.cursorYCoordinate,
            {
                maxWidth: PDFConstants.SIDE_BAR.TEXT_WIDTH,
                align: alignRight ? 'right' : "left"
            }
        );
    }

    private renderLineSeparator(): void {
        this.pdf.doc.setFillColor(PDFConstants.SIDE_BAR.TEXT_COLOR);

        this.pdf.doc.line(
            this.pdf.cursorXCoordinate,
            this.pdf.cursorYCoordinate,
            this.pdf.cursorXCoordinate + PDFConstants.SIDE_BAR.TEXT_WIDTH,
            this.pdf.cursorYCoordinate,
            'F'
        );
    }  
    
}