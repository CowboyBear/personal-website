import { Dimensions } from "../../../utils/Dimensions";
import { TitleAndDescriptionPair } from "../../../utils/TitleAndDescriptionPair";
import { PDFUtils } from "../../../utils/PDFUtils";
import { PDFSideBarUtils } from "../../../utils/PDFSideBarUtils";
import { PDFComponentRenderer } from "../PDFComponentRenderer";
import { PDFConstants } from "src/app/models/utils/PDFConstants";
import { PDFDocument } from "src/app/models/utils/PDFDocument";

export class AchievementRenderer implements PDFComponentRenderer<TitleAndDescriptionPair> {

    public achievement: TitleAndDescriptionPair    
    private utils: PDFSideBarUtils;
    private pdf: PDFDocument;

    constructor(pdf: PDFDocument, utils: PDFUtils) {        
        this.utils = utils.sideBar;
        this.pdf = pdf;       
    }    

    public setTarget(obj: TitleAndDescriptionPair): void {
        this.achievement = obj;
    }

    public render(): void {
        this.pdf.moveTo(PDFConstants.SIDE_BAR.LINE_START, this.pdf.cursorYCoordinate);
        
        this.utils.writeSubHeader(this.achievement.title);
        this.utils.addLineBreak(this.utils.getTextDimensions(this.achievement.title).height);
        this.utils.writeDefaultText(this.achievement.description);
        
        this.utils.addLineBreak(
            PDFConstants.DEFAULT_LINE_HEIGHT + this.utils.getTextDimensions(this.achievement.description).height
        );        
    }

    public getDimensions(): Dimensions{
        const subHeaderHeight: number = this.utils.simulateTextDimensions(this.achievement.title, 16).height;
        const textHeight: number = this.utils.simulateTextDimensions(this.achievement.description, 12).height;
        
        return new Dimensions(
            PDFConstants.SIDE_BAR.TEXT_WIDTH, 
            PDFConstants.DEFAULT_LINE_HEIGHT + subHeaderHeight + textHeight
        );
    }
}