import { Dimensions } from "src/app/models/utils/Dimensions";
import { PDFComponentRenderer } from "../PDFComponentRenderer";
import { PDFDocument } from "src/app/models/utils/PDFDocument";
import { PDFUtils } from "src/app/models/utils/PDFUtils";
import { SubHeaderTag } from "../utils/SubHeaderTag";
import { PDFConstants } from "src/app/models/utils/PDFConstants";

export class SubHeaderTagRenderer implements PDFComponentRenderer<SubHeaderTag> {
    private pdf: PDFDocument;    
    private utils: PDFUtils;
    private tag: SubHeaderTag;

    private readonly ICON_SIZE: number = 7;
    private readonly ICON_MARGIN: number = 3;
    private readonly TAGS_SPACING: number = 5;

    constructor(pdf: PDFDocument, utils: PDFUtils) {
        this.pdf = pdf;
        this.utils = utils;
    } 
    
    public setTarget(obj: SubHeaderTag): void {
        this.tag = obj;
    }
    
    public render(): void {                    
        this.pdf.setFontSize(13);
        this.pdf.doc.setTextColor(PDFConstants.TEXT_COLOR);

        const textDimensions = this.utils.getTextDimensions(this.tag.value);
                        
        this.pdf.doc.addImage(
            `../../../../../assets/img/resume/${this.tag.icon}.png`,
            'PNG',
            this.pdf.cursorXCoordinate,
            this.pdf.cursorYCoordinate - (this.ICON_SIZE - 1),
            this.ICON_SIZE,
            this.ICON_SIZE
        );

        this.pdf.moveTo(this.pdf.cursorXCoordinate + this.ICON_SIZE + this.ICON_MARGIN, this.pdf.cursorYCoordinate);
        this.utils.writeText(this.tag.value);
        this.pdf.moveTo(this.pdf.cursorXCoordinate + textDimensions.width + this.TAGS_SPACING, this.pdf.cursorYCoordinate);
    }
    
    public getDimensions(): Dimensions {
        const textDimensions = this.utils.getTextDimensions(this.tag.value);

        return new Dimensions(
            this.ICON_SIZE + this.ICON_MARGIN + textDimensions.width + this.TAGS_SPACING,
            textDimensions.height    
        );
    }      
}