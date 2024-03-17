import { Dimensions } from "../../utils/Dimensions";

export interface PDFComponentRenderer <T> {
    setTarget(obj: T): void;
    render(): void;
    getDimensions(): Dimensions;
}