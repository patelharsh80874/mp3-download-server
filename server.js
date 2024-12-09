// const express = require("express");
// const axios = require("axios");
// const ffmpeg = require("fluent-ffmpeg");
// const fs = require("fs");
// const path = require("path");

// const app = express();
// app.use(express.json());

// app.post("/generate-audio", async (req, res) => {
//     const { audioUrl, imageUrl, songName, year, album } = req.body;

//     if (!audioUrl || !imageUrl || !songName || !year || !album) {
//         return res.status(400).send({ error: "Audio URL, Image URL, Song Name, Year, and Album are required!" });
//     }

//     try {
//         // Temporary paths
//         const audioPath = path.resolve(__dirname, "temp", "temp_audio.mp4");
//         const convertedAudioPath = path.resolve(__dirname, "temp", "temp_audio.mp3");
//         const imagePath = path.resolve(__dirname, "temp", "temp_image.webp");
//         const convertedImagePath = path.resolve(__dirname, "temp", "temp_image.jpg");
//         const outputPath = path.resolve(__dirname, "temp", `${songName}.mp3`);

//         // Download the audio file
//         await downloadFile(audioUrl, audioPath);

//         // Convert audio to MP3 with 320kbps bitrate
//         await convertAudioToMp3(audioPath, convertedAudioPath);

//         // Download the image file
//         await downloadFile(imageUrl, imagePath);

//         // Convert image to JPG
//         await convertImageToJpg(imagePath, convertedImagePath);

//         // Embed the cover image and add metadata (song name, year, album) to the MP3 file
//         ffmpeg(convertedAudioPath)
//             .addInput(convertedImagePath)
//             .outputOptions("-map", "0", "-map", "1", "-c", "copy")
//             .outputOptions("-metadata", `title=${songName}`)
//             .outputOptions("-metadata", `year=${year}`)
//             .outputOptions("-metadata", `album=${album}`)
//             .outputOptions("-id3v2_version", "3")
//             .output(outputPath)
//             .on("end", () => {
//                 console.log("Metadata embedded successfully.");
//                 res.download(outputPath, `${songName}.mp3`, () => {
//                     // Clean up temporary files
//                     fs.unlinkSync(audioPath);
//                     fs.unlinkSync(convertedAudioPath);
//                     fs.unlinkSync(imagePath);
//                     fs.unlinkSync(convertedImagePath);
//                     fs.unlinkSync(outputPath);
//                 });
//             })
//             .on("error", (err) => {
//                 console.error("FFmpeg Error:", err);
//                 res.status(500).send({ error: "Failed to process the audio file." });
//             })
//             .run();
//     } catch (err) {
//         console.error(err);
//         res.status(500).send({ error: "Something went wrong!" });
//     }
// });

// // Helper function to download files
// async function downloadFile(fileUrl, outputPath) {
//     const response = await axios({
//         url: fileUrl,
//         method: "GET",
//         responseType: "stream",
//     });

//     const writer = fs.createWriteStream(outputPath);
//     response.data.pipe(writer);

//     return new Promise((resolve, reject) => {
//         writer.on("finish", resolve);
//         writer.on("error", reject);
//     });
// }

// // Helper function to convert audio to MP3 (with 320kbps)
// function convertAudioToMp3(inputPath, outputPath) {
//     return new Promise((resolve, reject) => {
//         ffmpeg(inputPath)
//             .toFormat("mp3")
//             .audioBitrate(320)  // Set audio bitrate to 320kbps
//             .on("end", resolve)
//             .on("error", reject)
//             .save(outputPath);
//     });
// }

// // Helper function to convert image to JPG
// function convertImageToJpg(inputPath, outputPath) {
//     return new Promise((resolve, reject) => {
//         ffmpeg(inputPath)
//             .toFormat("mjpeg")
//             .on("end", resolve)
//             .on("error", reject)
//             .save(outputPath);
//     });
// }

// // Start the server
// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });





const express = require("express");
const axios = require("axios");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");

const app = express();

// Use express.json() only for POST requests; GET doesn't need this
// app.use(express.json());

app.get("/", (req, res)=>{
   res.send("Hello , mp3-download-server")
})

app.get("/generate-audio", async (req, res) => {
    // Get data from query parameters
    const { audioUrl, imageUrl, songName, year, album } = req.query;

    // Validate that all required parameters are provided
    if (!audioUrl || !imageUrl || !songName || !year || !album) {
        return res.status(400).send({ error: "Audio URL, Image URL, Song Name, Year, and Album are required!" });
    }

    try {
        // Temporary paths for audio, image, and output
        const audioPath = path.resolve(__dirname, "temp", "temp_audio.mp4");
        const convertedAudioPath = path.resolve(__dirname, "temp", "temp_audio.mp3");
        const imagePath = path.resolve(__dirname, "temp", "temp_image.webp");
        const convertedImagePath = path.resolve(__dirname, "temp", "temp_image.jpg");
        const outputPath = path.resolve(__dirname, "temp", `${songName}.mp3`);

        // Download the audio file
        await downloadFile(audioUrl, audioPath);

        // Convert audio to MP3 with 320kbps bitrate
        await convertAudioToMp3(audioPath, convertedAudioPath);

        // Download the image file
        await downloadFile(imageUrl, imagePath);

        // Convert image to JPG
        await convertImageToJpg(imagePath, convertedImagePath);

        // Embed the cover image and add metadata (song name, year, album) to the MP3 file
        ffmpeg(convertedAudioPath)
            .addInput(convertedImagePath)
            .outputOptions("-map", "0", "-map", "1", "-c", "copy")
            .outputOptions("-metadata", `title=${songName}`)
            .outputOptions("-metadata", `year=${year}`)
            .outputOptions("-metadata", `album=${album}`)
            .outputOptions("-id3v2_version", "3")
            .output(outputPath)
            .on("end", () => {
                console.log("Metadata embedded successfully.");
                res.download(outputPath, `${songName}.mp3`, () => {
                    // Clean up temporary files
                    fs.unlinkSync(audioPath);
                    fs.unlinkSync(convertedAudioPath);
                    fs.unlinkSync(imagePath);
                    fs.unlinkSync(convertedImagePath);
                    fs.unlinkSync(outputPath);
                });
            })
            .on("error", (err) => {
                console.error("FFmpeg Error:", err);
                res.status(500).send({ error: "Failed to process the audio file." });
            })
            .run();
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Something went wrong!" });
    }
});

// Helper function to download files
async function downloadFile(fileUrl, outputPath) {
    const response = await axios({
        url: fileUrl,
        method: "GET",
        responseType: "stream",
    });

    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
    });
}

// Helper function to convert audio to MP3 (with 320kbps)
function convertAudioToMp3(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .toFormat("mp3")
            .audioBitrate(320)  // Set audio bitrate to 320kbps
            .on("end", resolve)
            .on("error", reject)
            .save(outputPath);
    });
}

// Helper function to convert image to JPG
function convertImageToJpg(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .toFormat("mjpeg")
            .on("end", resolve)
            .on("error", reject)
            .save(outputPath);
    });
}

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
