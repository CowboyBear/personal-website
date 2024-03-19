import { Dimensions } from "../../../utils/Dimensions";
import { TitleAndDescriptionPair } from "../../../utils/TitleAndDescriptionPair";
import { PDFUtils } from "../../../utils/PDFUtils";
import { PDFSideBarUtils } from "../../../utils/PDFSideBarUtils";
import { PDFComponentRenderer } from "../PDFComponentRenderer";
import { PDFConstants } from "src/app/models/utils/PDFConstants";
import { PDFDocument } from "src/app/models/utils/PDFDocument";

export class LanguageRenderer implements PDFComponentRenderer<TitleAndDescriptionPair> {

    public language: TitleAndDescriptionPair    
    private utils: PDFSideBarUtils;    

    private formattedLanguageTitle: string;
    private pdf: PDFDocument;

    constructor(pdf: PDFDocument, utils: PDFUtils) {        
        this.utils = utils.sideBar;
        this.pdf = pdf;       
    }      
    
    public setTarget(obj: TitleAndDescriptionPair): void {
        this.language = obj;
        this.formattedLanguageTitle = `• ${this.language.title} (${this.language.description})`
    }

    public render(): void {
        this.pdf.moveTo(PDFConstants.SIDE_BAR.LINE_START, this.pdf.cursorYCoordinate);
        this.utils.writeSubHeader(this.formattedLanguageTitle);
        this.utils.addLineBreak(
            PDFConstants.DEFAULT_LINE_HEIGHT 
            + this.utils.getTextDimensions(this.formattedLanguageTitle).height
        );
    }

    public getDimensions(): Dimensions{            
        return new Dimensions(
            PDFConstants.SIDE_BAR.TEXT_WIDTH, 
            PDFConstants.DEFAULT_LINE_HEIGHT 
            + this.utils.getTextDimensions(this.formattedLanguageTitle).height
        ); 
    }
}