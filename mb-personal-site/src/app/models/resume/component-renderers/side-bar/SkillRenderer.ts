import { Dimensions } from "../../../utils/Dimensions";
import { PDFConstants } from "../../../utils/PDFConstants";
import { PDFDocument } from "../../../utils/PDFDocument";
import { PDFSideBarUtils } from "../../../utils/PDFSideBarUtils";
import { PDFUtils } from "../../../utils/PDFUtils";
import { Skill } from "../../Skill";
import { PDFComponentRenderer } from "../PDFComponentRenderer";

export class SkillRenderer implements PDFComponentRenderer<Skill> {
    public skill: Skill;
    
    private utils: PDFSideBarUtils;
    private pdf: PDFDocument;
    
    private readonly BACKGROUND_HEIGHT = 6;
    private readonly FILLING_HEIGHT = this.BACKGROUND_HEIGHT - 1;
    private readonly FILLING_MAX_WIDTH = PDFConstants.SIDE_BAR.TEXT_WIDTH - 1;
    private readonly AMOUNT_OF_RECTS = 10;
    private readonly AMOUNT_OF_SPACES = this.AMOUNT_OF_RECTS - 1;
    private readonly SPACE_BETWEEN_RECTS = 2;        
    private readonly FILLING_WIDTH = (this.FILLING_MAX_WIDTH - this.SPACE_BETWEEN_RECTS * this.AMOUNT_OF_SPACES)/this.AMOUNT_OF_RECTS;

    private readonly ROUND_FACTOR = 3;

    constructor(pdf: PDFDocument, utils: PDFUtils) { 
        this.pdf = pdf;       
        this.utils = utils.sideBar;        
    }    

    public setTarget(obj: Skill): void {
        this.skill = obj;
    }

    public render(): void {
        this.utils.writeSubHeader(this.skill.name);
        this.utils.addLineBreak(this.utils.getTextDimensions(this.skill.name).height);
        
        this.renderBackground();
        this.renderProgress(this.skill.level);

        this.utils.addLineBreak(PDFConstants.DEFAULT_LINE_HEIGHT + this.BACKGROUND_HEIGHT);        
    }

    public getDimensions(): Dimensions{
        // TODO: Implement this
        return new Dimensions(0, 0);
    }
    
    private renderBackground(): void {
        this.pdf.doc.roundedRect(
            this.pdf.cursorXCoordinate, 
            this.pdf.cursorYCoordinate,
            PDFConstants.SIDE_BAR.TEXT_WIDTH,
            this.BACKGROUND_HEIGHT,
            this.ROUND_FACTOR,
            this.ROUND_FACTOR,
            'F'
        );
    }

    private renderProgress(level: number) : void {                
        this.pdf.moveTo(
            this.pdf.cursorXCoordinate + 0.5, 
            this.pdf.cursorYCoordinate + 0.5
        );
        
        let isFirst: boolean = true;
        let initialLevel: number = level;
        
        this.pdf.doc.setFillColor(PDFConstants.SIDE_BAR.BACKGROUND_COLOR);

        while(level > 0) {
            if(isFirst) {
                isFirst = false;
                this.drawEdgeProgressIndicator();                                
            } else if(level == 1 && initialLevel == 10) {
                this.drawEdgeProgressIndicator(true);
            } else {
                this.pdf.doc.rect(
                    this.pdf.cursorXCoordinate, 
                    this.pdf.cursorYCoordinate, 
                    this.FILLING_WIDTH, 
                    this.FILLING_HEIGHT, 
                    'F'
                );
            }
            
            this.pdf.moveTo(
                this.pdf.cursorXCoordinate + this.SPACE_BETWEEN_RECTS + this.FILLING_WIDTH, 
                this.pdf.cursorYCoordinate
            );
            
            level--;
        }       
    }

    private drawEdgeProgressIndicator(right?: boolean): void {                
        this.pdf.doc.roundedRect(
            this.pdf.cursorXCoordinate, 
            this.pdf.cursorYCoordinate,
            this.FILLING_WIDTH,
            this.FILLING_HEIGHT,
            this.ROUND_FACTOR,
            this.ROUND_FACTOR,
            'F'
        );
        
        const HALF_PROGRESS_BAR_FILL_WIDTH = this.FILLING_WIDTH / 2;
        
        this.pdf.doc.rect(
            right ? this.pdf.cursorXCoordinate : this.pdf.cursorXCoordinate + HALF_PROGRESS_BAR_FILL_WIDTH,
            this.pdf.cursorYCoordinate,
            HALF_PROGRESS_BAR_FILL_WIDTH,
            this.FILLING_HEIGHT,
            'F'
        );
    }
}