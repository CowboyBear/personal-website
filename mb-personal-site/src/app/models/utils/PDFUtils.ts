import { PDFDocument } from "./PDFDocument";
import { PDFSideBarUtils } from "./PDFSideBarUtils";

export class PDFUtils {
    public sideBar: PDFSideBarUtils;
    
    private pdf: PDFDocument;    

    constructor(pdf: PDFDocument) {
        this.pdf = pdf;             
        this.sideBar = new PDFSideBarUtils(pdf);
    }    
}