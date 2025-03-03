export class PDFConstants {
    public static readonly PAGE_HEIGHT: number = 632;
    public static readonly PAGE_WIDTH: number = 447;
    public static readonly HORIZONTAL_PADDING: number = 20;
    public static readonly VERTICAL_PADDING: number = 30;
    public static readonly FONT_SIZE_SCALE: number = 0.571;  
    public static readonly TEXT_COLOR = '#384347';  
    public static readonly DEFAULT_LINE_HEIGHT: number = 13;
    public static readonly CYAN_COLOR = '#1ab0b3';  


    public static readonly SIDE_BAR: any = class {
        public static readonly WIDTH = PDFConstants.PAGE_WIDTH * 0.35;
        public static readonly LINE_START = PDFConstants.HORIZONTAL_PADDING;
        public static readonly TEXT_COLOR = '#FFFFFF';
        public static readonly BACKGROUND_COLOR = '#046864';
        public static readonly TEXT_WIDTH = this.WIDTH - (PDFConstants.HORIZONTAL_PADDING * 2);
    };        

    public static readonly LINE_START = PDFConstants.SIDE_BAR.WIDTH + PDFConstants.HORIZONTAL_PADDING;   
    public static readonly LINE_END = this.PAGE_WIDTH - this.HORIZONTAL_PADDING;
    public static readonly MAX_TEXT_WIDTH = this.PAGE_WIDTH - (PDFConstants.SIDE_BAR.WIDTH + this.HORIZONTAL_PADDING * 2);
}