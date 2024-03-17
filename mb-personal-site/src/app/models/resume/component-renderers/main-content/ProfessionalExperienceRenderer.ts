import { Dimensions } from "src/app/models/utils/Dimensions";
import { PDFComponentRenderer } from "../PDFComponentRenderer";
import { PDFDocument } from "src/app/models/utils/PDFDocument";
import { PDFUtils } from "src/app/models/utils/PDFUtils";
import { Position } from "src/app/models/site-content/Position";
import { ProfessionalExperience } from "../../ProfessionalExperience";
import { TitleWithPeriodRenderer } from "./TitleWithPeriodRenderer";
import { DefaultTextRenderer } from "./DefaultTextRenderer";

export class ProfessionalExperienceRenderer implements PDFComponentRenderer<ProfessionalExperience> {
    private pdf: PDFDocument;    
    private utils: PDFUtils;
    private experience: ProfessionalExperience;

    private titleRenderer: TitleWithPeriodRenderer;
    private textRenderer: DefaultTextRenderer;

    constructor(pdf: PDFDocument, utils: PDFUtils) {
        this.pdf = pdf;
        this.utils = utils;

        this.titleRenderer = new TitleWithPeriodRenderer(this.pdf, this.utils);
        this.textRenderer = new DefaultTextRenderer(this.pdf, this.utils);
    } 
    
    public setTarget(obj: ProfessionalExperience): void {
        this.experience = obj;
    }
    
    // TODO: Maybe, revert the order of titles: First list the company, then the positions
    public render(): void {
        this.experience.positions.forEach((position: Position) => {                        
            this.titleRenderer.setTarget(position);                        
            this.textRenderer.setTarget(position.description);

            this.utils.handlePageBreak(this.getDimensions().height);

            this.titleRenderer.render();

            this.utils.writeHighlightedSubtitle(this.experience.company);            
            this.utils.addLineBreak(this.utils.getTextDimensions(this.experience.company).height + 2);

            this.utils.writeDefaultText(position.description);
            
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
        const subtitleDimensions: Dimensions = this.utils.simulateTextDimensions(this.experience.company, 14);                            
        const SUBTITLE_VERTICAL_PADDING = 2;

        return new Dimensions(
            Math.max(titleDimensions.width, descriptionDimensions.width, subtitleDimensions.width),
            titleDimensions.height + descriptionDimensions.height + subtitleDimensions.height + SUBTITLE_VERTICAL_PADDING
        );
    }      
}