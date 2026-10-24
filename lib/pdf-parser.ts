/**
 * Client-Side PDF Text Extraction using pdfjs-dist
 * Extracts plain text directly in the browser so that only raw text
 * is transmitted over the wire to the roast API.
 */

export interface ExtractedPdfResult {
  text: string;
  numPages: number;
}

export async function extractTextFromPdf(file: File): Promise<ExtractedPdfResult> {
  if (typeof window === 'undefined') {
    throw new Error('PDF extraction is only supported on the client side.');
  }

  // Dynamic import of pdfjs-dist to prevent any Next.js SSR build issues
  const pdfjsLib = await import('pdfjs-dist');

  // Point to local public worker for 100% offline & fast reliability
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
    isEvalSupported: false,
  });

  const pdfDocument = await loadingTask.promise;
  const numPages = pdfDocument.numPages;
  const textPieces: string[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum);
    const content = await page.getTextContent();
    
    // Concatenate text items with appropriate spacing
    const pageText = content.items
      .map((item: any) => (item && 'str' in item ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (pageText) {
      textPieces.push(`--- Page ${pageNum} ---\n${pageText}`);
    }
  }

  const fullText = textPieces.join('\n\n').trim();

  if (!fullText || fullText.length < 20) {
    throw new Error(
      'Could not extract readable text from this PDF. It may be an image-only scan or password protected.'
    );
  }

  return {
    text: fullText,
    numPages,
  };
}
