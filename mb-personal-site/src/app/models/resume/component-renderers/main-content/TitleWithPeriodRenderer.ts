import { Dimensions } from "src/app/models/utils/Dimensions";
import { PDFComponentRenderer } from "../PDFComponentRenderer";
import { PDFDocument } from "src/app/models/utils/PDFDocument";
import { PDFUtils } from "src/app/models/utils/PDFUtils";
import { TitleWithPeriod } from "../utils/TitleWithPeriod";

export class TitleWithPeriodRenderer implements PDFComponentRenderer<TitleWithPeriod> {
    private pdf: PDFDocument;    
    private utils: PDFUtils;
    private titleWithPeriod: TitleWithPeriod;

    constructor(pdf: PDFDocument, utils: PDFUtils) {
        this.pdf = pdf;
        this.utils = utils;
    } 
    
    public setTarget(obj: TitleWithPeriod): void {
        this.titleWithPeriod = obj;
    }
    
    public render(): void {        
        this.utils.renderTitleWithPeriodComponent(this.titleWithPeriod.title, this.titleWithPeriod.startDate, this.titleWithPeriod.endDate);
    }
    
    public getDimensions(): Dimensions {        
        const TITLE_VERTICAL_PADDING = 5;
        
        let dimensions: Dimensions = this.utils.simulateTextDimensions(this.titleWithPeriod.title, 16);
        dimensions.height += TITLE_VERTICAL_PADDING;
        
        return dimensions;
    }      
}