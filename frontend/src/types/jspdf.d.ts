declare module 'jspdf' {
  export class jsPDF {
    constructor(options?: any);
    internal: any;
    setFont(font: string, style?: string): this;
    setFontSize(size: number): this;
    setDrawColor(r: number, g?: number, b?: number): this;
    text(text: string, x: number, y: number): this;
    line(x1: number, y1: number, x2: number, y2: number): this;
    addPage(format?: string | string[], orientation?: string): this;
    output(type?: string): any;
  }
  const _default: any;
  export default _default;
}
