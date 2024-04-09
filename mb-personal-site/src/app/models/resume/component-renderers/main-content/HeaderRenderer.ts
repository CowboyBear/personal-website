import { Dimensions } from "src/app/models/utils/Dimensions";
import { PDFComponentRenderer } from "../PDFComponentRenderer";
import { PDFDocument } from "src/app/models/utils/PDFDocument";
import { PDFUtils } from "src/app/models/utils/PDFUtils";
import { PDFConstants } from "src/app/models/utils/PDFConstants";
import { ResumeHeader } from "../utils/ResumeHeader";
import { SubHeaderTag } from "../utils/SubHeaderTag";
import { SubHeaderTagRenderer } from "./SubHeaderTagRenderer";

export class HeaderRenderer implements PDFComponentRenderer<ResumeHeader> {
    private pdf: PDFDocument;    
    private utils: PDFUtils;
    private header: ResumeHeader;
    private lineCount: number = 0;

    private readonly MAX_CONTENT_WIDTH = PDFConstants.PAGE_WIDTH - PDFConstants.HORIZONTAL_PADDING;

    constructor(pdf: PDFDocument, utils: PDFUtils) {
        this.pdf = pdf;
        this.utils = utils;
    } 
    
    public setTarget(obj: ResumeHeader): void {

        this.header = obj;
    }
    
    public render(): void {
        this.pdf.doc.setPage(1);
        this.pdf.moveTo(PDFConstants.LINE_START, PDFConstants.VERTICAL_PADDING);        

        this.pdf.doc.setTextColor(PDFConstants.TEXT_COLOR);
        this.utils.writeHeader(this.header.personalInformation.name.toUpperCase());

        this.utils.addLineBreak();
        
        this.pdf.doc.setTextColor(PDFConstants.CYAN_COLOR);
        this.utils.writeSubHeader(this.header.position);

        this.utils.addLineBreak();

        this.renderSubHeaderTags(this.header.getSubHeaderTags());

        this.utils.addLineBreak(PDFConstants.DEFAULT_LINE_HEIGHT * 2);
    }
    
    public getDimensions(): Dimensions {
        let nameDimensions = this.utils.simulateTextDimensions(this.header.personalInformation.name.toUpperCase(), 28);
        let positionDimensions = this.utils.simulateTextDimensions(this.header.position, 16);
        let tagsDimensions = this.getTagsDimensions();
        
        const componentHeight = nameDimensions.height 
        + positionDimensions.height 
        + tagsDimensions.height 
        + PDFConstants.DEFAULT_LINE_HEIGHT * 4;
        
        return new Dimensions(
            this.MAX_CONTENT_WIDTH,
            componentHeight
        );
    }   

    private getTagsDimensions(): Dimensions {
        return new Dimensions(
            this.MAX_CONTENT_WIDTH,
            this.lineCount * PDFConstants.DEFAULT_LINE_HEIGHT
        );
    }

    private renderSubHeaderTags(tags: SubHeaderTag[]): void {        
        tags.forEach(tag => {
            let renderer: SubHeaderTagRenderer = new SubHeaderTagRenderer(this.pdf, this.utils);
            renderer.setTarget(tag);

            if(this.pdf.cursorXCoordinate + renderer.getDimensions().width > (this.MAX_CONTENT_WIDTH)){
                this.utils.addLineBreak();
                this.lineCount++;
            }

            renderer.render();            
        });        
    }

}