import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import { pdf, transformJSON } from "../utils";
import { QRCode } from "react-qrcode-logo";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

type QrDialog = {
	onClose: () => void;
	open: boolean;
	qrData: string;
};

export const QrDialog = ({ onClose, open, qrData }: QrDialog) => {
	// State to store logo properties
	const [logoProps, setLogoProps] = useState({
		logoImage: "",
		logoHeight: 0,
		logoWidth: 0,
	});

	useEffect(() => {
		// Load the logo image
		const logo = new Image();
		logo.src = "./ondc-network-vertical.png";

		logo.onload = () => {
			// Define base width for the logo
			const basewidth = 100;
			// Calculate new dimensions for the logo
			const wpercent = basewidth / logo.width;
			const hsize = logo.height * wpercent;
			// Create a canvas element to resize the logo
			const canvas = document.createElement("canvas");
			canvas.width = basewidth;
			canvas.height = hsize;
			const ctx = canvas.getContext("2d");

			// Use Lanczos interpolation to resize the logo
			if (ctx) {
				// Use Lanczos interpolation to resize the logo
				ctx.drawImage(logo, 0, 0, basewidth, hsize);
				const resizedLogoDataURL = canvas.toDataURL();

				// console.log("Actual Logo:", logo);
				// console.log("Resized Logo:", resizedLogoDataURL);
				// Set logo dimensions and data URL
				setLogoProps({
					logoImage: resizedLogoDataURL,
					logoHeight: hsize,
					logoWidth: basewidth,
				});
			}
		};
	}, []);

	const link = transformJSON(qrData);
	// const link = qrData;
  console.log("QR:::",link)

	const downloadQr = async () => {
		console.log("Downloading QR")

		const canvas: any = document.getElementById("qr-code-component");
    if(canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
			
			const pdfCreated = await pdf(pngUrl)
			const blob = new Blob([pdfCreated as Uint8Array], { type: 'application/pdf' });
			const blobUrl = URL.createObjectURL(blob);
			console.log("PDF GENERATED", pdfCreated)
			
      let downloadLink = document.createElement("a");
      downloadLink.href =   blobUrl; //pngUrl
      downloadLink.download = `QR.pdf`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
	}

	return (
		<Dialog onClose={onClose} open={open} >
			<DialogTitle
				style={{
					// textAlign: "center",
					fontWeight: "bold",
					color: "#728FCE",
					// fontSize: "40px",
				}}
                align="center"
                variant="h3"
			>
				ONDC QR se Bharat Khulega
			</DialogTitle>
			<DialogContent sx={{ display: "flex", justifyContent: "center"}}>
				<QRCode
					size={450}
					ecLevel="H"
					quietZone={4}
					value={link as string}
					logoImage={logoProps.logoImage}
					logoHeight={logoProps.logoHeight}
					logoWidth={logoProps.logoWidth}
					id="qr-code-component"
				/>
			</DialogContent>
			<DialogActions>
				<Button variant="contained" onClick={downloadQr}>Download QR</Button>
			</DialogActions>
		</Dialog>
	);
};