import { Dimensions } from "src/app/models/utils/Dimensions";
import { PDFComponentRenderer } from "../PDFComponentRenderer";
import { PDFDocument } from "src/app/models/utils/PDFDocument";
import { PDFUtils } from "src/app/models/utils/PDFUtils";
import { Education } from "src/app/models/site-content/Education";
import { TitleWithPeriodRenderer } from "./TitleWithPeriodRenderer";
import { TitleWithPeriod } from "../utils/TitleWithPeriod";
import { PDFConstants } from "src/app/models/utils/PDFConstants";

export class EducationRenderer implements PDFComponentRenderer<Education> {
    private pdf: PDFDocument;    
    private utils: PDFUtils;
    private education: Education;
    private titleRenderer: TitleWithPeriodRenderer

    private readonly PADDING_BOTTOM = 10;

    constructor(pdf: PDFDocument, utils: PDFUtils) {
        this.pdf = pdf;
        this.utils = utils;
        this.titleRenderer = new TitleWithPeriodRenderer(this.pdf, this.utils);
        this.titleRenderer.setTarget(this.utils.createStubTitle());
    } 
    
    public setTarget(obj: Education): void {
        this.education = obj;
    }
    
    public render(): void {        
        const title: TitleWithPeriod = new TitleWithPeriod({
            title: this.education.description,
            startDate: this.education.startDate,
            endDate: this.education.endDate
        });

        this.titleRenderer.setTarget(title);
        this.titleRenderer.render();

        this.utils.writeHighlightedSubtitle(this.education.name);
        this.utils.addLineBreak(this.utils.getTextDimensions(this.education.name).height + this.PADDING_BOTTOM);
    }
    
    public getDimensions(): Dimensions {        
        const subtitleHeight: number = this.utils.simulateTextDimensions(this.education.name, 14).height;
        const componentHeight: number = this.titleRenderer.getDimensions().height
            + subtitleHeight
            + this.PADDING_BOTTOM;

        return new Dimensions(PDFConstants.MAX_TEXT_WIDTH, componentHeight);
    }      
}