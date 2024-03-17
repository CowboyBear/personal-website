import { Dimensions } from "../../../utils/Dimensions";
import { PDFDocument } from "../../../utils/PDFDocument";
import { TitleAndDescriptionPair } from "../../../utils/TitleAndDescriptionPair";
import { PDFUtils } from "../../../utils/PDFUtils";
import { PDFSideBarUtils } from "../../../utils/PDFSideBarUtils";
import { PDFComponentRenderer } from "../PDFComponentRenderer";

export class LanguageRenderer implements PDFComponentRenderer<TitleAndDescriptionPair> {

    public language: TitleAndDescriptionPair    
    private sideBarUtils: PDFSideBarUtils;    

    constructor(utils: PDFUtils) {                  
        this.sideBarUtils = utils.sideBar;        
    }    
    
    public setTarget(obj: TitleAndDescriptionPair): void {
        this.language = obj;
    }

    public render(): void {
        const formatted: string = `• ${this.language.title} (${this.language.description})`;
        this.sideBarUtils.writeSubHeader(formatted);
        this.sideBarUtils.addLineBreak(this.sideBarUtils.getTextDimensions(formatted).height);
        this.sideBarUtils.addLineBreak();
    }

    public getDimensions(): Dimensions{
        // TODO: Implement this
        return null;   
    }
}