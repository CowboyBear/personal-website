import jsPDF from "jspdf";

export class PDFDocument {
    public doc: jsPDF;
    public cursorXCoordinate: number;
    public cursorYCoordinate: number;
    
    private readonly FONT_SIZE_SCALE: number = 0.571;

    constructor(doc: jsPDF, cursorXCoordinate: number, cursorYCoordinate: number) {
        this.doc = doc;
        this.cursorXCoordinate = cursorXCoordinate;
        this.cursorYCoordinate = cursorYCoordinate;
    }

    public moveTo(x: number, y: number): void {
        this.cursorXCoordinate = x;
        this.cursorYCoordinate = y;
    }

    public setFontSize(size: number): void {
        this.doc.setFontSize(size * this.FONT_SIZE_SCALE);
    }
}