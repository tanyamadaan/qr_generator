import React from 'react';
import { pdfjs } from 'react-pdf';
import { Document } from 'react-pdf';


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PDFViewerProps {
  pdfUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl }) => {
  
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Document file={pdfUrl}/>
    </div>
  );
};

export default PDFViewer;
