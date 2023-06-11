import {Download as spDownload} from "sp-download";

export default async function pullExcelData(outputPath, options = { backoff: 0 }) {

    const fileUrl = 'https://iecm064-my.sharepoint.com/personal/boris_mallick_mediaschool_education/Documents/Partages/Planning%20annuel%20BTS%20SIO%202022-2023.xlsx';
    let calendarDL;

    try {
        calendarDL = new spDownload(); //uses sp-auth under the hood. And sp-auth uses node-sp-auth-config.
    } catch (e) {
        console.error("Error while initializing SP download", e);
        return;
    }

    calendarDL.downloadFile(fileUrl, outputPath)
        .then((savedToPath) => {
            console.log(`File saved to ${savedToPath}`);
            return savedToPath;
        })
        .catch(async e => {
            console.error("Error while downloading SP: ", e);
            if (options.backoff > 5) { throw new Error(e) }

            //retry with backoff
            await new Promise(r => setTimeout(r, 2 ** options.backoff * 1000))
            return await pullExcelData(outputPath, { backoff: options.backoff+1 });
        })
}