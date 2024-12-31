# The Ultimate Songs Download Server/MP3/Audio Metadata Embedder

The Ultimate Songs Download Server/MP3/Audio Metadata Embedder allows users to generate audio files with embedded metadata and cover art. This server leverages Node.js, Express, and FFmpeg to provide seamless functionality for downloading customized MP3 files.

## Features
- Embed cover art into MP3 files.
- Add metadata such as song title, year, album name, and artist name.
- Process audio and images directly from URLs.

  <img width="959" alt="image" src="https://github.com/user-attachments/assets/39b6164e-6404-43b1-845f-a361de2c4e5a" />


---

## API Endpoint

### **`/generate-audio`**
Generates an MP3 file with embedded cover art and metadata.

#### **Request Type**
`GET`

#### **Query Parameters**
| Parameter    | Type     | Required | Description                                           |
|--------------|----------|----------|-------------------------------------------------------|
| `audioUrl`   | `string` | Yes      | The URL of the audio file to process.                 |
| `imageUrl`   | `string` | Yes      | The URL of the cover image to embed.                  |
| `songName`   | `string` | Yes      | The name of the song.                                 |
| `year`       | `string` | Yes      | The year the song was released.                       |
| `album`      | `string` | Yes      | The album name to embed in the metadata.              |
| `artist`     | `string` | Yes      | The artist name to embed in the metadata.             |

#### Example Request
```bash
GET https://the-ultimate-songs-download-server.up.railway.app/generate-audio?audioUrl={AudioURL}&imageUrl={ImageURL}&songName={Name}&year={Year}&album={AlbumName}&artist={ArtistName}
```

#### Example Usage
```bash
curl "https://the-ultimate-songs-download-server.up.railway.app/generate-audio?audioUrl=https://example.com/audio.mp4&imageUrl=https://example.com/image.jpg&songName=MySong&year=2024&album=MyAlbum&artist=MyArtist"
```

---

## How It Works
1. **Audio Processing**: The server downloads the audio file from the given `audioUrl` and converts it to an MP3 format with a 320kbps bitrate.
2. **Image Processing**: The cover image is downloaded from `imageUrl` and converted to a compatible JPEG format if necessary.
3. **Metadata Embedding**: Metadata such as `songName`, `year`, `album`, and `artist` is embedded into the MP3 file.
4. **File Delivery**: The processed MP3 file is served as a downloadable file.

---

## Prerequisites
- Ensure you have the correct URLs for both audio and image files.
- Make sure the `audioUrl` points to a valid audio file (e.g., `.mp4`, `.mp3`).
- Make sure the `imageUrl` points to a valid image file (e.g., `.jpg`, `.png`).

---

## Example Responses

### Successful Response
- **Status Code**: `200 OK`
- The server responds with a downloadable MP3 file.

### Error Responses
- **Status Code**: `400 Bad Request`
  ```json
  {
      "error": "Audio URL, Image URL, Song Name, Year, Album, and Artist are required!"
  }
  ```
- **Status Code**: `500 Internal Server Error`
  ```json
  {
      "error": "Failed to process the audio file."
  }
  ```

---

## Deployments

The server is hosted on multiple platforms:

### Railway
- **Base URL**: `https://the-ultimate-songs-download-server.up.railway.app`
- **API Endpoint**: `https://the-ultimate-songs-download-server.up.railway.app/generate-audio?audioUrl={AudioURL}&imageUrl={ImageURL}&songName={Name}&year={Year}&album={AlbumName}&artist={ArtistName}`

### Render
- **Base URL**: `https://mp3-download-server.onrender.com`
- **API Endpoint**: `https://mp3-download-server.onrender.com/generate-audio?audioUrl={AudioURL}&imageUrl={ImageURL}&songName={Name}&year={Year}&album={AlbumName}&artist={ArtistName}`

### Back4App
- **Base URL**: `https://theultimatesongsdownloadserver-yavzqarj.b4a.run`
- **API Endpoint**: `https://theultimatesongsdownloadserver-yavzqarj.b4a.run/generate-audio?audioUrl={AudioURL}&imageUrl={ImageURL}&songName={Name}&year={Year}&album={AlbumName}&artist={ArtistName}`

#### Example Usage
```bash
curl "https://mp3-download-server.onrender.com/generate-audio?audioUrl=https://example.com/audio.mp4&imageUrl=https://example.com/image.jpg&songName=MySong&year=2024&album=MyAlbum&artist=MyArtist"
```

---

## How to Set Up Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/patelharsh80874/mp3-download-server
   cd your-repo-name
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node server.js
   ```

4. Access the server locally:
   ```
   http://localhost:3000/generate-audio?audioUrl={AudioURL}&imageUrl={ImageURL}&songName={Name}&year={Year}&album={AlbumName}&artist={ArtistName}
   ```

---

## Deployment
This server can be deployed to platforms like [Railway](https://railway.app/), [Render](https://render.com/), or [Back4App](https://www.back4app.com/). Ensure that FFmpeg is included in the deployment environment.

---

## License
This project is licensed under the MIT License. See the LICENSE file for details.
