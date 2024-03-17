import { Dimensions } from "src/app/models/utils/Dimensions";
import { PDFComponentRenderer } from "../PDFComponentRenderer";
import { PDFDocument } from "src/app/models/utils/PDFDocument";
import { PDFUtils } from "src/app/models/utils/PDFUtils";
import { Education } from "src/app/models/site-content/Education";
import { TitleWithPeriodRenderer } from "./TitleWithPeriodRenderer";
import { TitleWithPeriod } from "../utils/TitleWithPeriod";

export class EducationRenderer implements PDFComponentRenderer<Education> {
    private pdf: PDFDocument;    
    private utils: PDFUtils;
    private education: Education;

    constructor(pdf: PDFDocument, utils: PDFUtils) {
        this.pdf = pdf;
        this.utils = utils;
    } 
    
    public setTarget(obj: Education): void {
        this.education = obj;
    }
    
    public render(): void {  
        let titleRenderer: TitleWithPeriodRenderer = new TitleWithPeriodRenderer(this.pdf, this.utils);
        const title: TitleWithPeriod = new TitleWithPeriod({
            title: this.education.description,
            startDate: this.education.startDate,
            endDate: this.education.endDate
        });

        titleRenderer.setTarget(title);

        titleRenderer.render();

        this.utils.writeHighlightedSubtitle(this.education.name);
        this.utils.addLineBreak(this.utils.getTextDimensions(this.education.name).height + 10);
    }
    
    public getDimensions(): Dimensions {
        // TODO: Implement this
        throw new Error("Method not implemented.");
    }      
}