import { Dimensions } from "src/app/models/utils/Dimensions";
import { PDFComponentRenderer } from "../PDFComponentRenderer";
import { PDFDocument } from "src/app/models/utils/PDFDocument";
import { PDFUtils } from "src/app/models/utils/PDFUtils";

export class SummaryRenderer implements PDFComponentRenderer<string> {
    private pdf: PDFDocument;    
    private utils: PDFUtils;
    private summary: string;

    constructor(pdf: PDFDocument, utils: PDFUtils) {
        this.pdf = pdf;
        this.utils = utils;
    } 
    
    public setTarget(obj: string): void {
        this.summary = obj;
    }
    
    public render(): void {        
        this.utils.renderSectionSeparator('SUMMARY');

        this.utils.writeDefaultText(this.summary);

        this.pdf.moveTo(
            this.pdf.cursorXCoordinate,
            this.pdf.cursorYCoordinate + this.utils.getTextDimensions(this.summary).height
        ); 

        this.utils.addLineBreak();
    }
    
    public getDimensions(): Dimensions {
        // TODO: Implement this
        throw new Error("Method not implemented.");
    }      
}