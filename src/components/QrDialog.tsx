import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import { pdf, transformJSON } from "../utils";
import { QRCode } from "react-qrcode-logo";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { Document, Page, pdfjs } from "react-pdf";
import { useTheme } from "@mui/material/styles";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type QrDialogProps = {
  onClose: () => void;
  open: boolean;
  qrData: string;
  providerName: string;
};

export const QrDialog = ({
  onClose,
  open,
  qrData,
  providerName,
}: QrDialogProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [logoProps, setLogoProps] = useState({
    logoImage: "",
    logoHeight: 0,
    logoWidth: 0,
  });
  // const [width, setWidth] = useState(window.innerWidth);

  // useEffect(() => {
  //   setWidth(window.innerWidth);
  // }, []);

  const theme = useTheme();
  const viewportWidth = window.innerWidth;

  const breakpoints = {
    xs: theme.breakpoints.values.xs, // e.g., 0
    sm: theme.breakpoints.values.sm, // e.g., 600
    md: theme.breakpoints.values.md, // e.g., 960
    lg: theme.breakpoints.values.lg, // e.g., 1280
    xl: theme.breakpoints.values.xl, // e.g., 1536
  };

  let qrScale = 0.165;

  if (viewportWidth < 420) {
    qrScale = 0.094;
  } else if (viewportWidth >= 420 && viewportWidth < breakpoints.sm) {
    qrScale = 0.11;
  } else if (
    viewportWidth >= breakpoints.sm &&
    viewportWidth < breakpoints.md
  ) {
    qrScale = 0.165;
  } else if (
    viewportWidth >= breakpoints.md &&
    viewportWidth < breakpoints.lg
  ) {
    qrScale = 0.165;
  } else if (
    viewportWidth >= breakpoints.lg &&
    viewportWidth < breakpoints.xl
  ) {
    qrScale = 0.165;
  } else {
    qrScale = 0.165;
  }

  useEffect(() => {
    const generatePdf = async () => {
      setTimeout(async () => {
        const canvas: any = document.getElementById("qr-code-component");

        if (canvas) {
          const pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");

          const pdfCreated = await pdf(pngUrl, providerName, qrScale);
          const blob = new Blob([pdfCreated as Uint8Array], {
            type: "application/pdf",
          });
          const blobUrl = URL.createObjectURL(blob);
          console.log("blobUrl", blobUrl);
          setPdfUrl(blobUrl);
          console.log("blobUrl", blobUrl);
        }
      }, 10);
    };

    if (open) {
      generatePdf();
    }
  }, [open]);

  useEffect(() => {
    const logo = new Image();
    logo.src = "./ondc-network-vertical.png";

    logo.onload = () => {
      const basewidth = 100;
      const wpercent = basewidth / logo.width;
      const hsize = logo.height * wpercent;
      const canvas = document.createElement("canvas");
      canvas.width = basewidth;
      canvas.height = hsize;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(logo, 0, 0, basewidth, hsize);
        const resizedLogoDataURL = canvas.toDataURL();

        setLogoProps({
          logoImage: resizedLogoDataURL,
          logoHeight: hsize,
          logoWidth: basewidth,
        });
      }
    };
  }, []);

  const downloadQr = async () => {
    console.log("Downloading QR");

    const canvas: any = document.getElementById("qr-code-component");
    console.log(canvas);
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");

      const pdfCreated = await pdf(pngUrl, providerName, qrScale);
      const blob = new Blob([pdfCreated as Uint8Array], {
        type: "application/pdf",
      });
      const blobUrl = URL.createObjectURL(blob);
      console.log("PDF GENERATED", pdfCreated);

      let downloadLink = document.createElement("a");
      downloadLink.href = blobUrl; //pngUrl
      downloadLink.download = `${providerName} QR.pdf`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const link = transformJSON(qrData);

  console.log("pdfUrl", pdfUrl);

  return (
    <Dialog onClose={onClose} open={open} maxWidth="md">
      <DialogContent>
        {pdfUrl && (
          <Document file={pdfUrl}>
            <Page pageNumber={1} />
          </Document>
        )}
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
        <Button variant="contained" onClick={downloadQr}>
          Download QR
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QrDialog;
