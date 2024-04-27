import { PDFDocument, StandardFonts } from "pdf-lib";

export async function pdf(qrCodeImageBytes: any, providerName: string) {
  try {
    // Load existing PDF
    const response = await fetch("Poster.pdf");
    const existingPdfBytes = await response.arrayBuffer();

    // Load QR code image
    // const qrCodeImageBytes = await fs.readFile('qr.png'); // Assuming the QR code image is in the same directory
    // console.log("qrCodeImageBytes", qrCodeImageBytes)
    // const qrCodeImage = await PDFDocument.createEmbeddedPng(qrCodeImageBytes);
    // console.log("qrCodeImage", qrCodeImage)

    // Load PDF document
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const qrImage = await pdfDoc.embedPng(qrCodeImageBytes);
    // console.log("qrImage", qrImage)

    // Embed QR code image
    const qrDims = qrImage.scale(0.165); // Adjust size as needed
    // console.log("qrDims", qrDims)
    // console.log("qrImage", qrImage)
    const page = pdfDoc.getPages()[0]; // Assuming first page
    const qrX = 230; // X coordinate
    const qrY = 500; // Y coordinate
    page.drawImage(qrImage, {
      x: qrX,
      y: qrY,
      width: qrDims.width,
      height: qrDims.height,
    });

    page.setFontSize(35);

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText(
      providerName.length > 20
        ? `${providerName.substring(0, 20).trim()}...`
        : providerName,
      {
        x: 140,
        y: 700,
        size: 30,
        font: helveticaFont,
      }
    );

    // Save modified PDF
    const modifiedPdfBytes = await pdfDoc.save();
    // fs.writeFileSync('../assets/modified.pdf', modifiedPdfBytes);

    console.log("PDF modification completed successfully.");
    return modifiedPdfBytes;
  } catch (error) {
    console.error("Error:", error);
  }
}

// pdf();
