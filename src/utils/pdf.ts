import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getTextPlacement } from "./getTextPlacement";

export async function pdf(
	qrCodeImageBytes: any,
	providerName: string,
	scale: number
) {
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

		const qrDims = qrImage.scale(scale); // Adjust size as needed
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

		const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

		providerName = providerName.replace(/(\w)(\w*)/g, function (_g0, g1, g2) {
			return g1.toUpperCase() + g2.toLowerCase();
		});

		const pageWidth = page.getWidth();

		const textWithPositions = getTextPlacement(
			providerName,
			700,
			pageWidth,
			helveticaFont
		);
		textWithPositions.forEach(({ text, x, y, size, lineHeight }) => {
			page.drawText(text, {
				x,
				y,
				size,
				font: helveticaFont,
				color: rgb(0.35, 0.35, 0.35),
				lineHeight,
				// textAlign: TextAlignment.Center,
			});
		});


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
