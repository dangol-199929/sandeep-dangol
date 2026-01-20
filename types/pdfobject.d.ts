declare module 'pdfobject' {
  interface PDFObjectOptions {
    height?: string | number
    width?: string | number
    omitInlineStyles?: boolean
    fallbackLink?: string
    suppressConsole?: boolean
    pdfOpenParams?: {
      toolbar?: number
      navpanes?: number
      pagemode?: string
      page?: string | number
      zoom?: string | number
      [key: string]: any
    }
    [key: string]: any
  }

  interface PDFObject {
    embed(url: string, target: string | HTMLElement, options?: PDFObjectOptions): HTMLElement | boolean
  }

  const PDFObject: PDFObject
  export default PDFObject
}