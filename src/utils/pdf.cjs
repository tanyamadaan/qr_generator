const { PDFDocument, PNG } = require('pdf-lib');
const fs = require('fs').promises;

async function pdf() {
  try {
    // Load existing PDF
    const existingPdfBytes = await fs.readFile('../assets/Poster.pdf');

    // Load QR code image
    const qrCodeImageBytes = await fs.readFile('qr.png'); // Assuming the QR code image is in the same directory
    console.log("qrCodeImageBytes", qrCodeImageBytes)
    // const qrCodeImage = await PDFDocument.createEmbeddedPng(qrCodeImageBytes);
    // console.log("qrCodeImage", qrCodeImage)

    // Load PDF document
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const qrImage = await pdfDoc.embedPng(qrCodeImageBytes);
    console.log("qrImage", qrImage)

    // Embed QR code image
    const qrDims = qrImage.scale(0.23); // Adjust size as needed
    console.log("qrDims", qrDims)
    console.log("qrImage", qrImage)
    const page = pdfDoc.getPages()[0]; // Assuming first page
    const qrX = 280; // X coordinate
    const qrY = 530; // Y coordinate
    page.drawImage(qrImage, {
      x: qrX,
      y: qrY,
      width: qrDims.width,
      height: qrDims.height,
    });

    // Save modified PDF
    const modifiedPdfBytes = await pdfDoc.save();
    await fs.writeFile('modified.pdf', modifiedPdfBytes);

    console.log('PDF modification completed successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
}

pdf();