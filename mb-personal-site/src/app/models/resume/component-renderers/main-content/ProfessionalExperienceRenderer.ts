import { Dimensions } from "src/app/models/utils/Dimensions";
import { PDFComponentRenderer } from "../PDFComponentRenderer";
import { PDFDocument } from "src/app/models/utils/PDFDocument";
import { PDFUtils } from "src/app/models/utils/PDFUtils";
import { Position } from "src/app/models/site-content/Position";
import { TitleWithPeriodRenderer } from "./TitleWithPeriodRenderer";
import { DefaultTextRenderer } from "./DefaultTextRenderer";
import { Career } from "src/app/models/site-content/Career";

export class ProfessionalExperienceRenderer implements PDFComponentRenderer<Career> {
    private pdf: PDFDocument;    
    private utils: PDFUtils;
    private career: Career;

    private titleRenderer: TitleWithPeriodRenderer;
    private textRenderer: DefaultTextRenderer;

    private readonly SUBTITLE_VERTICAL_PADDING = 2;

    constructor(pdf: PDFDocument, utils: PDFUtils) {
        this.pdf = pdf;
        this.utils = utils;

        this.titleRenderer = new TitleWithPeriodRenderer(this.pdf, this.utils);         
        this.titleRenderer.setTarget(this.utils.createStubTitle());
        this.textRenderer = new DefaultTextRenderer(this.pdf, this.utils);
        this.textRenderer.setTarget('');
    }     

    public setTarget(obj: Career): void {
        this.career = obj;
    }
        
    public render(): void {
        let title: any = {
            title: this.career.company,
            startDate: this.career.startDate,
            endDate: this.career.endDate
        }

        this.titleRenderer.setTarget(title);
        this.titleRenderer.render();
        
        this.career.positions.reverse().forEach((position: Position) => {                                                
            this.textRenderer.setTarget(position.description);
            this.utils.handlePagination(this.getDimensions().height);

            this.utils.writeHighlightedSubtitle(position.title);            
            this.utils.addLineBreak(this.utils.getTextDimensions(position.title).height + this.SUBTITLE_VERTICAL_PADDING);

            this.textRenderer.render();            
            
            this.pdf.moveTo(
                this.pdf.cursorXCoordinate,
                this.pdf.cursorYCoordinate + this.utils.getTextDimensions(position.description).height
            )            
            
            this.utils.addLineBreak(10);
        });
    }    
    
    public getDimensions(): Dimensions {        
        const titleDimensions: Dimensions = this.titleRenderer.getDimensions();
        const descriptionDimensions: Dimensions = this.textRenderer.getDimensions();
        const subtitleDimensions: Dimensions = this.utils.simulateTextDimensions('someSubtitle', 14);                                    

        return new Dimensions(
            Math.max(titleDimensions.width, descriptionDimensions.width, subtitleDimensions.width),
            titleDimensions.height + descriptionDimensions.height + subtitleDimensions.height + this.SUBTITLE_VERTICAL_PADDING
        );
    }     
        
}