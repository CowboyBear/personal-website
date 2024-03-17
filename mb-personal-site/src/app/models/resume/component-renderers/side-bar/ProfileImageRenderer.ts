import { Dimensions } from "../../../utils/Dimensions";
import { PDFConstants } from "../../../utils/PDFConstants";
import { PDFSideBarUtils } from "../../../utils/PDFSideBarUtils";
import { PDFDocument } from "../../../utils/PDFDocument";
import { PDFUtils } from "../../../utils/PDFUtils";
import { PDFComponentRenderer } from "../PDFComponentRenderer";

export class ProfileImageRenderer implements PDFComponentRenderer<string> {

    private pdf: PDFDocument;    
    private utils: PDFSideBarUtils;
    private imagePath: string;

    constructor(pdf: PDFDocument, utils: PDFUtils) {
        this.pdf = pdf;
        this.utils = utils.sideBar;
    }   
    
    public setTarget(obj: string): void {
        this.imagePath = obj;
    }

    public render(): void {
        const dimensions: Dimensions = this.getDimensions();        

        this.pdf.moveTo(
            PDFConstants.SIDE_BAR.WIDTH / 2 - dimensions.width / 2,
            this.pdf.cursorYCoordinate + PDFConstants.VERTICAL_PADDING - this.pdf.doc.getLineHeight()
        );        

        this.pdf.doc.addImage(
            this.imagePath,
            this.getImageType(),
            this.pdf.cursorXCoordinate,
            this.pdf.cursorYCoordinate,
            dimensions.width,
            dimensions.width
        );

        this.utils.addLineBreak(dimensions.height);
    }

    private getImageType() {
        let matches = this.imagePath.match(/\.(?<format>\w*)$/);        
        return matches[1].toUpperCase();
    }

    public getDimensions(): Dimensions{
        const IMAGE_WIDTH = this.getImageWidth();        
        const BOTTOM_PADDING = 20;

        return new Dimensions(IMAGE_WIDTH, IMAGE_WIDTH +  BOTTOM_PADDING);
    }

    private getImageWidth(): number {
        return PDFConstants.SIDE_BAR.WIDTH * 0.4;
    }

}