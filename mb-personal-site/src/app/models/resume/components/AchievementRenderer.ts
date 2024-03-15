import { Dimensions } from "../../utils/Dimensions";
import { PDFDocument } from "../../utils/PDFDocument";
import { TitleAndDescriptionPair } from "../../utils/TitleAndDescriptionPair";
import { PDFUtils } from "../../utils/PDFUtils";
import { PDFSideBarUtils } from "../../utils/PDFSideBarUtils";

export class AchievementRenderer {

    public achievement: TitleAndDescriptionPair    
    private utils: PDFSideBarUtils;

    constructor(pdf: PDFDocument, utils: PDFUtils) {        
        this.utils = utils.sideBar;        
    }    

    public render(): void {
        this.utils.writeSubHeader(this.achievement.title);
        this.utils.addLineBreak(this.utils.getTextDimensions(this.achievement.title).height);
        this.utils.writeDefaultText(this.achievement.description);
        this.utils.addLineBreak(this.utils.getTextDimensions(this.achievement.description).height);

        this.utils.addLineBreak();
    }

    public getDimensions(): Dimensions{
        // TODO: Implement this
        return null;   
    }
}