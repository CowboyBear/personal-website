import { Dimensions } from "src/app/models/utils/Dimensions";
import { PDFComponentRenderer } from "../PDFComponentRenderer";
import { PDFDocument } from "src/app/models/utils/PDFDocument";
import { PDFUtils } from "src/app/models/utils/PDFUtils";
import { Position } from "src/app/models/site-content/Position";

export class DefaultTextRenderer implements PDFComponentRenderer<string> {
    private pdf: PDFDocument;    
    private utils: PDFUtils;
    private text: string;

    constructor(pdf: PDFDocument, utils: PDFUtils) {
        this.pdf = pdf;
        this.utils = utils;
    } 
    
    public setTarget(obj: string): void {
        this.text = obj;
    }
    
    public render(): void {        
        this.utils.writeDefaultText(this.text);
    }
    
    public getDimensions(): Dimensions {
        const TEXT_VERTICAL_PADDING = 5;
        
        let dimensions: Dimensions = this.utils.simulateTextDimensions(this.text, 12);
        dimensions.height += TEXT_VERTICAL_PADDING;
        
        return dimensions;
    }      
}