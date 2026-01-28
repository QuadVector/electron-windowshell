const https = require('https');
const fs = require('fs');

const downloadURL = "https://github.com/QuadVector/electron-fluent-template/raw/refs/heads/Dev/src/core/download.zip";
const downloadPath = "./src/core/download.zip";

console.log("Updating core...");

//check is archive exists and then delet it if it is
if(fs.existsSync(downloadPath)) {
    fs.unlinkSync(downloadPath);
}

//download the archive
console.log("Downloading archive...");
https.get(downloadURL, (response) => {
    const file = fs.createWriteStream(downloadPath);
    response.pipe(file);
});