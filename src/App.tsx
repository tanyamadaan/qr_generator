import React, { useState, useEffect } from "react";
import { Layout } from "./Layout";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { QrDialog } from "./components";
import { parseCSV, ProviderData } from "./utils/data"; // Assuming you have exported the function to parse CSV and generate data
import Stack from "@mui/material/Stack";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import { DOMAIN_MAPPING, POPOVER_MESSAGES } from "./assets/constants";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";

function App() {
	const [theme] = useState<"light" | "dark">("light");
	const [showQrDialog, setShowQrDialog] = useState(false);
	const [selectedProviderName, setSelectedProviderName] = useState<string>("");
	const [selectedBppId, setSelectedBppId] = useState<string>("");
	const [uniqueProviderNames, setUniqueProviderNames] = useState<string[]>([]);
	const [selectedDomain, setSelectedDomain] = useState<string>("");
	const [data, setData] = useState<ProviderData[]>([]);
	const [selectedStreet, setSelectedStreet] = useState<string>("");

	const [popoverAnchor, setPopoverAnchor] = useState<{
		anchor: HTMLElement | null;
		message: string;
	}>();

	const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
		setPopoverAnchor({
			anchor: event.currentTarget,
			message:
				POPOVER_MESSAGES[
					event.currentTarget.id as keyof typeof POPOVER_MESSAGES
				].message,
		});
	};
	const handlePopoverClose = () => {
		setPopoverAnchor({ anchor: null, message: "" });
	};

	useEffect(() => {
		parseCSV()
			.then((parsedData) => {
				setData(parsedData);
				const uniqueNames = [
					...new Set(parsedData.map((item) => item.provider_name)),
				];
				setUniqueProviderNames(uniqueNames);
			})
			.catch((error) => {
				console.error("Error parsing CSV:", error);
			});
	}, []);

	const bppIdOptions = [
		...new Set(
			data
				.filter((item) => item.provider_name === selectedProviderName)
				.map((item) => item.bpp_id)
		),
	];

	const streetOptions = [
		...new Set(
			data
				.filter((item) => item.provider_name === selectedProviderName)
				.map((item) => item.street)
		),
	];

	const domainOptions = [
		...new Set(
			data
				.filter(
					(item) =>
						item.provider_name === selectedProviderName &&
						item.bpp_id === selectedBppId
				)
				.map((item) => item.domain)
		),
	];

	useEffect(() => {
		if (bppIdOptions.length == 1) {
			setSelectedBppId(bppIdOptions[0]);
		}
		if (domainOptions.length == 1) {
			setSelectedDomain(domainOptions[0]);
		}
	}, [bppIdOptions, domainOptions]);

	const handleGenerateQR = () => {
		setShowQrDialog(true);
	};

	// Function to get provider_id based on selected options
	const getProviderId = () => {
		const selectedData = data.find(
			(item) =>
				item.provider_name === selectedProviderName &&
				item.bpp_id === selectedBppId &&
				item.domain === selectedDomain
		);
		return selectedData?.provider_id ?? "";
	};

	return (
		<Layout theme={theme}>
			<Container
				sx={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					flexDirection: "column",
					py: 2,
				}}
			>
				<img src={"./ondc_logo.png"} alt="logo" />
				<Typography variant="h4">
					<i>QR Code Generator</i>
				</Typography>
				<Paper
					sx={{
						p: 2,
						maxWidth: 350,
						width: "100%",
						display: "flex",
						flexDirection: "column",
					}}
				>
					<Stack direction="row" spacing={1} alignItems="center" my={1}>
						<Autocomplete
							freeSolo
							value={selectedProviderName}
							onChange={(_event, newValue) => {
								setSelectedProviderName(newValue || "");
							}}
							inputValue={selectedProviderName}
							onInputChange={(_event, newInputValue) =>
								setSelectedProviderName(newInputValue)
							}
							options={uniqueProviderNames}
							renderInput={(params) => (
								<TextField {...params} label="Type your Store Name" />
							)}
							fullWidth
						/>
						<IconButton
							onMouseOver={handlePopoverOpen}
							onMouseLeave={handlePopoverClose}
							id={POPOVER_MESSAGES.providerName.id}
						>
							<InfoTwoToneIcon />
						</IconButton>
					</Stack>
					{selectedProviderName.length > 0 && ( // Conditionally render bpp_id and domain dropdowns
						<>
							<Stack direction="row" spacing={1} my={1}>
								<FormControl fullWidth sx={{ my: 2 }}>
									<InputLabel id="bpp-id-select-label">
										Seller Network Participant
									</InputLabel>
									<Select
										labelId="bpp-id-select-label"
										id="bpp-id-select"
										value={selectedBppId}
										onChange={(event) =>
											setSelectedBppId(event.target.value as string)
										}
									>
										{bppIdOptions.map((bppId) => (
											<MenuItem key={bppId} value={bppId}>
												{bppId}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<IconButton
									onMouseOver={handlePopoverOpen}
									onMouseLeave={handlePopoverClose}
									id={POPOVER_MESSAGES.bppId.id}
								>
									<InfoTwoToneIcon />
								</IconButton>
							</Stack>
							<Stack direction="row" spacing={1}>
								<FormControl fullWidth sx={{ my: 2 }}>
									<InputLabel variant="outlined" id="domain-select-label">
										Domain
									</InputLabel>
									<Select
										labelId="domain-select-label"
										id="domain-select"
										value={selectedDomain}
										onChange={(event) =>
											setSelectedDomain(event.target.value as string)
										}
									>
										{domainOptions.map((domain) => (
											<MenuItem key={domain} value={domain}>
												{DOMAIN_MAPPING[domain as keyof typeof DOMAIN_MAPPING]}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<IconButton
									onMouseOver={handlePopoverOpen}
									onMouseLeave={handlePopoverClose}
									id={POPOVER_MESSAGES.domain.id}
								>
									<InfoTwoToneIcon />
								</IconButton>
							</Stack>
							<Stack direction="row" spacing={1} my={1}>
								<FormControl fullWidth sx={{ my: 2 }}>
									<InputLabel id="store-street">Store Address</InputLabel>
									<Select
										labelId="store-street"
										id="store-street-select"
										value={selectedStreet}
										onChange={(event) =>
											setSelectedStreet(event.target.value as string)
										}
									>
										{streetOptions.map((street) => (
											<MenuItem key={street} value={street}>
												{street}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<IconButton
									onMouseOver={handlePopoverOpen}
									onMouseLeave={handlePopoverClose}
									id={POPOVER_MESSAGES.street.id}
								>
									<InfoTwoToneIcon />
								</IconButton>
							</Stack>
							<Stack direction="row" spacing={1} my={1}>
								<FormControl fullWidth sx={{ my: 2 }}>
									{/* <InputLabel variant="outlined" id="domain-select-label">
										Provider ID
									</InputLabel> */}
									<TextField
										label="Provider ID"
										value={
											data.filter(
												(e) =>
													e.bpp_id === selectedBppId &&
													e.provider_name === selectedProviderName
											)[0]?.provider_id || ""
										}
										disabled
									/>
								</FormControl>
								<IconButton
									onMouseOver={handlePopoverOpen}
									onMouseLeave={handlePopoverClose}
									id={POPOVER_MESSAGES.providerId.id}
								>
									<InfoTwoToneIcon />
								</IconButton>
							</Stack>
						</>
					)}
					<Button
						variant="contained"
						fullWidth
						sx={{ mt: 2 }}
						onClick={handleGenerateQR}
					>
						Generate QR
					</Button>
					<Typography variant="caption" mt={2}>
						<b>Note</b>: In case of doubt please reach out to your seller
						network particpant.
					</Typography>
				</Paper>
				<QrDialog
					onClose={() => setShowQrDialog(false)}
					open={showQrDialog}
					qrData={JSON.stringify({
						"context.bpp_id": selectedBppId,
						"context.domain": selectedDomain,
						"message.intent.provider.id": getProviderId(),
						// "message.provider.street": selectedStreet,
						// "message.provider.locality": selectedLocality,
					})}
					providerName={selectedProviderName}
				/>
				<Popover
					sx={{
						pointerEvents: "none",
					}}
					open={Boolean(popoverAnchor?.anchor)}
					anchorEl={popoverAnchor?.anchor}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "left",
					}}
					transformOrigin={{
						vertical: "top",
						horizontal: "left",
					}}
					onClose={handlePopoverClose}
					disableRestoreFocus
				>
					<Typography sx={{ p: 1 }}>{popoverAnchor?.message}</Typography>
				</Popover>
			</Container>
		</Layout>
	);
}

export default App;
