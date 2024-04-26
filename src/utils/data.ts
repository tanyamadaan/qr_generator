import Papa, { ParseResult } from 'papaparse';

type provider_data = {
    bpp_id: string;
    provider_id: string;
    domain: string;
    provider_name: string;
};

export const parseCSV = async () => {
    const csvFilePath = 'sample_data.csv'; // Assuming the CSV file is in the "assets" directory

    try {
        const response = await fetch(csvFilePath);
        if (!response.ok) {
            throw new Error(`Failed to fetch CSV file: ${response.statusText}`);
        }

        const fileContent = await response.text();
        // console.log("fileContent:: ", fileContent)

        const { data: result, errors }: ParseResult<provider_data> = Papa.parse(fileContent, {
            header: true, // Assuming the first row contains headers
            skipEmptyLines: true,
        });

        if (errors.length > 0) {
            throw new Error(`CSV parsing errors: ${errors.join(', ')}`);
        }

        const filteredResult: provider_data[] = result.filter((item: provider_data) => {
            return item.domain.startsWith("ONDC:RET");
        });

        return filteredResult as provider_data[];
    } catch (error) {
        console.error('Error fetching/parsing CSV:', error);
        throw error;
    }
};