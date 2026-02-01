const https = require("https");
const fs = require("fs");

const downloadURL =
    "https://github.com/QuadVector/electron-fluent-template/raw/refs/heads/Dev/src/core.zip";
const downloadPath = "./src/core.zip";
const corePath = "./src/core";

async function downloadFile(url, targetFile) {
    return await new Promise((resolve, reject) => {
        https
            .get(url, (response) => {
                const code = response.statusCode ?? 0;

                if (code >= 400) {
                    return reject(new Error(response.statusMessage));
                }

                // handle redirects
                if (code > 300 && code < 400 && !!response.headers.location) {
                    return resolve(
                        downloadFile(response.headers.location, targetFile),
                    );
                }

                // save the file to disk
                const fileWriter = fs
                    .createWriteStream(targetFile)
                    .on("finish", () => {
                        resolve({});
                    });

                response.pipe(fileWriter);
            })
            .on("error", (error) => {
                reject(error);
            });
    });
}

console.log("Updating core...");

//check is archive exists and then delet it if it is
if (fs.existsSync(downloadPath)) {
    fs.unlinkSync(downloadPath);
}

//download the archive
console.log("Downloading archive...");
downloadFile(downloadURL, downloadPath).then(() => {
    console.log("Archive downloaded!");

    console.log("Removing old core...");
    try {
        fs.rmSync(corePath, {
            recursive: true,
            force: true,
            maxRetries: 10,
            retryDelay: 100,
        });
        console.log("Old core removed!");
    } catch (e) {
        console.error("Failed to remove core:", e);
    }
    console.log("Old core removed!");

    console.log("Starting extraction...");

    process.exit(0);
});
