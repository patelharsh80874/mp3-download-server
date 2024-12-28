
const express = require("express");
const axios = require("axios");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();

// Ensure temp folder exists or create it
const tempFolder = path.resolve(__dirname, "temp");
if (!fs.existsSync(tempFolder)) {
  fs.mkdirSync(tempFolder);
}

app.get("/", (req, res) => {
  const formHTML = `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>THE ULTIMATE MP3 Metadata Embedder</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <link
    href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css"
    rel="stylesheet"
/>
    <style>
        /* Global Styles */
        body {
            background-color: #141414; /* Dark background */
            color: white;
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        /* Form Container */
        .form-container {
            // background-color: rgba(0, 0, 0, 0.7);
            border-radius: 12px;
            padding-left: 5%;
            width: 90%;
            // max-width: 500px;
            // box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        }

        h1 {
            font-size: 24px;
            text-align: center;
            color: #ffcb00;
            margin-bottom: 20px;
        }

        label {
            font-size: 14px;
            color: #b3b3b3;
            font-weight: 500;
            margin-bottom: 5px;
            display: block;
        }

        input {
            width: 80%;
            padding: 12px;
            margin-bottom: 15px;
            border: 2px solid #333;
            background-color: #222;
            color: #fff;
            border-radius: 8px;
            font-size: 14px;
        }

        input:focus {
            outline: none;
            border-color: #ffcb00;
        }

        button {
            width: 25%;
            padding: 12px;
            background-color: #ffcb00;
            color: #141414;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        button:hover {
            background-color: #ffb400;
        }

        /* Success and Error Message */
        #message {
            margin-top: 20px;
            text-align: center;
            font-size: 14px;
            font-weight: 600;
        }

        .success {
            color: #28a745;
        }

        .error {
            color: #dc3545;
        }
            .info-div{
            display:flex;
            align-items: center;
            justify-content: center;
            gap:1vw;
            }
    </style>
</head>
<body>
    <div class="form-container">
    <div class="info-div">
    <h1>THE ULTIMATE MP3 Metadata Embedder<span style="font-size: 14px; color: #b3b3b3;"> (made by HARSH PATEL)</span></h1>
    <a href="https://github.com/patelharsh80874/mp3-download-server" target="_blank" title="GitHub Repository" style="text-decoration: none;">
    <i class="ri-github-fill" style="font-size: 36px; color: #b3b3b3;"></i>
</a>

        <a href="https://instagram.com/patelharsh.in" target="_blank" title="instagram" style="text-decoration: none;">
    <i class="ri-instagram-fill" style="font-size: 36px; color: #b3b3b3;"></i>
</a>

    </div>
        <form id="mp3Form">
            <label for="audioUrl">Audio URL:</label>
            <input type="url" id="audioUrl" name="audioUrl" required>

            <label for="imageUrl">Image URL:</label>
            <input type="url" id="imageUrl" name="imageUrl" required>

            <label for="songName">Song/Audio Name:</label>
            <input type="text" id="songName" name="songName" required>

            <label for="year">Year:</label>
            <input type="text" id="year" name="year" required>

            <label for="album">Album Name:</label>
            <input type="text" id="album" name="album" required>

            <button type="submit">Submit</button>
            <div id="message"></div>
        </form>
    </div>

    <script>
        document.getElementById('mp3Form').addEventListener('submit', function(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new URLSearchParams(new FormData(form));
    
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = "Submitting... your audio is being processed"; // Show loading message
    messageDiv.className = ""; // Clear previous classes
    
    // Extract the song name from the form data
    const songName = form.querySelector('input[name="songName"]').value || 'your_audio';  // Default to 'your_audio' if not provided

    // Make the request to generate the audio and handle the response
    fetch('/generate-audio?' + formData.toString(), {
        method: 'GET',
        headers: {
            'Accept': 'application/json', // Ensure server returns response in JSON
        }
    })
    .then(response => {
        if (response.ok) {
            // File is being processed and will be downloaded
            return response.blob();  // Return the audio file as blob for download
        } else {
            throw new Error('Error generating audio');
        }
    })
    .then(blob => {
        // Create a download link and simulate a click to start the download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = songName + '.mp3'; // Use string concatenation instead of template literals
        link.click();
        

        // Success message after file is downloaded
        setTimeout(() => {
            form.reset();
            messageDiv.textContent = "Form submitted successfully! Your audio is ready for download.";
            messageDiv.className = "success";
        }, 500);
    })
    .catch(error => {
        // Handle errors (e.g., network issues, server issues)
        setTimeout(() => {
            messageDiv.textContent = "Error occurred. Please try again. Or Check Your Audio/Image URL Is Correct Or Not.";
            messageDiv.className = "error";
        }, 500);
    });
});

    </script>
</body>
</html>


    `;
  res.send(formHTML);
});

app.get("/generate-audio", async (req, res) => {
  const { audioUrl, imageUrl, songName, year, album } = req.query;

  if (!audioUrl || !imageUrl || !songName || !year || !album) {
    return res.status(400).send({
      error: "Audio URL, Image URL, Song Name, Year, and Album are required!",
    });
  }

  const uniqueId = uuidv4(); // Generate unique ID for this request
  const requestTempFolder = path.resolve(tempFolder, uniqueId);

  try {
    // Create a unique temporary folder for this request
    if (!fs.existsSync(requestTempFolder)) {
      fs.mkdirSync(requestTempFolder);
    }

    const audioPath = path.resolve(requestTempFolder, "temp_audio.mp4");
    const convertedAudioPath = path.resolve(
      requestTempFolder,
      "temp_audio.mp3"
    );
    const imagePath = path.resolve(requestTempFolder, "temp_image.webp");
    const convertedImagePath = path.resolve(
      requestTempFolder,
      "temp_image.jpg"
    );
    const outputPath = path.resolve(requestTempFolder, `${songName}.mp3`);

    // Download and process files
    await downloadFile(audioUrl, audioPath);
    await convertAudioToMp3(audioPath, convertedAudioPath);
    await downloadFile(imageUrl, imagePath);
    await convertImageToJpg(imagePath, convertedImagePath);

    // Embed metadata and send the file
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
          // Clean up temporary folder
          fs.rmSync(requestTempFolder, { recursive: true, force: true });
        });
      })
      .on("error", (err) => {
        console.error("FFmpeg Error:", err);
        fs.rmSync(requestTempFolder, { recursive: true, force: true });
        res.status(500).send({ error: "Failed to process the audio file." });
      })
      .run();
  } catch (err) {
    console.error(err);
    fs.rmSync(requestTempFolder, { recursive: true, force: true });
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
      .audioBitrate(320)
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
