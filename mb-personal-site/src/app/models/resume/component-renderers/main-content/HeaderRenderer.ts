import { Dimensions } from "src/app/models/utils/Dimensions";
import { PDFComponentRenderer } from "../PDFComponentRenderer";
import { PDFDocument } from "src/app/models/utils/PDFDocument";
import { PDFUtils } from "src/app/models/utils/PDFUtils";
import { PDFConstants } from "src/app/models/utils/PDFConstants";
import { PersonalInformation } from "src/app/models/site-content/PersonalInformation";

export class HeaderRenderer implements PDFComponentRenderer<PersonalInformation> {
    private pdf: PDFDocument;    
    private utils: PDFUtils;
    private personalInformation: PersonalInformation;

    constructor(pdf: PDFDocument, utils: PDFUtils) {
        this.pdf = pdf;
        this.utils = utils;
    } 
    
    public setTarget(obj: PersonalInformation): void {
        this.personalInformation = obj;
    }
    
    public render(): void {
        this.pdf.moveTo(PDFConstants.LINE_START, PDFConstants.VERTICAL_PADDING);        

        this.pdf.doc.setTextColor(PDFConstants.TEXT_COLOR);
        this.utils.writeHeader(this.personalInformation.name.toUpperCase());

        this.utils.addLineBreak();
        
        this.pdf.doc.setTextColor(PDFConstants.CYAN_COLOR);
        this.utils.writeSubHeader('Application Architect | IT Manager'); // TODO: Add this to the resume config

        this.utils.addLineBreak();

        this.renderPersonalInformationSection([
            this.personalInformation.email,
            this.personalInformation.github,
            'Curitiba, PR', // TODO: Add this to the resume config
            window.location.origin
        ]);

        this.utils.addLineBreak(PDFConstants.DEFAULT_LINE_HEIGHT * 2);
    }
    
    public getDimensions(): Dimensions {
        // TODO: Implement this
        throw new Error("Method not implemented.");
    }   
    
    private renderPersonalInformationSection(lines: string[]): void {
        const ICON_MARGIN = 7;
        const TAGS_SPACING = 10;
        this.pdf.setFontSize(13);
        this.pdf.doc.setTextColor(PDFConstants.TEXT_COLOR);

        lines.forEach(line => {
            const textDimensions = this.utils.getTextDimensions(line);
            const newXPosition = this.pdf.cursorXCoordinate + textDimensions.width + TAGS_SPACING;

            this.breakLineIfRequired(newXPosition + ICON_MARGIN);

            // TODO: Swap @ with the icon 
            this.utils.writeText('@');
            this.pdf.moveTo(this.pdf.cursorXCoordinate + ICON_MARGIN, this.pdf.cursorYCoordinate);            
            this.utils.writeText(line);

            this.pdf.moveTo(newXPosition, this.pdf.cursorYCoordinate);
        });

    }

    private breakLineIfRequired(newXPosition: number) {
        if (newXPosition > (PDFConstants.PAGE_WIDTH - PDFConstants.HORIZONTAL_PADDING)) {
            this.utils.addLineBreak();
        }
    }

}