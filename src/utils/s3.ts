import { GetObjectCommand, S3Client, S3, GetObjectCommandInput } from "@aws-sdk/client-s3";
import csv from "csv-parser";
//import { writeFileSync } from "fs";
const credentials = {
    region: "ap-south-1",
    credentials: {
        accessKeyId: "AKIAYIRZUKVULSVUWNNG",
        secretAccessKey: "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"
    }
};
//const client = new S3Client(credentials);
const s3 = new S3(credentials);
const s3data = "./s3data.csv"


// async function download(data) {
//     const header = Object.keys(data[0])
//     const headerString = header.join(',');
//     const replacer = (key, value) => value ?? '';
//     const rowItems = data.map((row) =>
//         header.map((key) => JSON.stringify(row[key], replacer)).join(',')
//     );
//     const csv = [headerString, ...rowItems].join('\n');
//     writeFileSync(s3data, JSON.stringify(csv));
//     return s3data
// }


async function getObject(params: GetObjectCommandInput) {
    const results: any[] = [];
    // const bpp_id_list = [];
    // const domain_list = [];
    // const provider_id_list = [];
    // Run the Process
    const file = (await s3.getObject(params)).Body
    file
        .pipe(csv())
        .on("data", function (data: { domain: string; bpp_id: any; provider_id: any; }) {
            if (!data.domain.startsWith("nic") && data.domain && data.bpp_id && data.provider_id) {
                results.push(data);
            } 
        })
        .on("end", () => {
            console.log("csv parse process finished");
            //console.log(results)
            // const rowItems = results.map((row) =>
            //     bpp_id_list.push(row['bpp_id']),
            //     domain_list.push(row['domain']),
            //     provider_id_list.push(row['provider_id'])
            // );
            // console.log(bpp_id_list)
            //download(results)
        });
    return results
}


export function getdata(bucket: string, key: string): Promise<any> {

    try {
        // let p = new Promise((resolve, reject) => {
            const s3Object = getObject({
                Bucket: bucket,
                Key: key,
            })
        // });
        return s3Object
    } catch (err) {
        console.error('Error while downloading object from S3', err)
        throw err
    }
}

//const data = await getdata("ondc-athena-results", "outputs/Unsaved/2024/04/19/d9b5f599-fa72-4b14-956d-5684f07427fe.csv")

// const bucket = "ondc-athena-results"
// const key = "outputs/Unsaved/2024/04/19/d9b5f599-fa72-4b14-956d-5684f07427fe.csv"

// function fetchData() {
//     return getdata(bucket, key); // Await here to get the resolved data
// }

// async function getMappedOptions() {
//     const data = await fetchData(); // Wait for the data to be resolved
//     const options = data.map((row) => row['bpp_id']); // Map the resolved data
// 	return options
// }

// const data = fetchData()
// data.then((response) => {
//     console.log(`Received response: ${response.status}`);
//   });

// console.log("data", data)
// console.log("mapping", await getMappedOptions())