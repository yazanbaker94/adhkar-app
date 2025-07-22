# Quran Video Generation Feature

This feature allows users to create beautiful videos of Quran verses with customizable backgrounds, reciters, and text styling.

## Features

- **Verse Selection**: Choose any surah and ayah from the Quran
- **Reciter Selection**: Multiple famous reciters available
- **Background Customization**: Pre-built backgrounds or upload custom images
- **Text Styling**: Customize font size and text color
- **Audio Preview**: Listen to the verse before generating
- **Video Preview**: See how the final video will look
- **Download & Share**: Download the generated video or share links

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Install FFmpeg

The video generation requires FFmpeg to be installed on your system.

#### Windows:
1. Download FFmpeg from https://ffmpeg.org/download.html
2. Extract to a folder (e.g., `C:\ffmpeg`)
3. Add the `bin` folder to your system PATH
4. Or uncomment and update the FFmpeg path in `server.js`:
   ```javascript
   ffmpeg.setFfmpegPath('C:\\ffmpeg\\bin\\ffmpeg.exe');
   ```

#### macOS:
```bash
brew install ffmpeg
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install ffmpeg
```

### 3. Add Background Images

Place background images in the `img/backgrounds/` directory:

- `mosque_1.jpg` - Beautiful mosque background
- `kaaba.jpg` - Kaaba background
- `medina.jpg` - Medina background
- `nature.jpg` - Nature/landscape background
- `geometric.jpg` - Geometric Islamic pattern
- `gradient.jpg` - Gradient background

**Image specifications:**
- Format: JPG or PNG
- Resolution: 1920x1080 (16:9) or higher
- File size: Under 2MB per image

### 4. Start the Server

```bash
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

### GET `/api/reciters`
Returns available reciters for video generation.

### GET `/api/backgrounds`
Returns available background images.

### GET `/api/verse-audio/:surah/:ayah/:reciter`
Returns audio URL for a specific verse and reciter.

### POST `/api/generate-video`
Generates a video with the specified parameters.

**Parameters:**
- `surah` (number): Surah number
- `ayah` (number): Ayah number
- `reciter` (string): Reciter ID
- `backgroundId` (string): Background image ID
- `textColor` (string): Text color (hex)
- `fontSize` (number): Font size in pixels
- `background` (file): Custom background image (optional)

### GET `/api/download/:videoId`
Downloads the generated video.

### GET `/api/share/:videoId`
Returns video information for sharing.

## Usage

### 1. Access the Video Generator

Click on the "إنشاء الفيديو" (Video Generator) tab in the app.

### 2. Select a Verse

1. Choose a surah from the dropdown
2. Select an ayah from the dropdown
3. The verse text and translation will be displayed

### 3. Choose a Reciter

Select from available reciters:
- Abdul Basit Abdul Samad
- Mishary Rashid Alafasy
- Abdur-Rahman As-Sudais
- Saud Al-Shuraim
- Saad Al-Ghamdi
- Mahmoud Khalil Al-Husary
- Muhammad Siddiq Al-Minshawi

### 4. Select Background

- Choose from predefined backgrounds
- Or upload a custom image

### 5. Customize Text

- Adjust font size (24-72px)
- Choose text color
- Preview changes in real-time

### 6. Preview Audio

Click "استمع للآية" to hear the verse before generating.

### 7. Generate Video

Click "إنشاء الفيديو" to start generation. The process includes:
- Downloading audio from Quran API
- Processing background image
- Adding text overlay with FFmpeg
- Creating final MP4 video

### 8. Download or Share

Once generated, you can:
- Download the video directly
- Share via native sharing or copy link

## Technical Details

### Video Generation Process

1. **Audio Download**: Fetches audio from mp3quran.net API
2. **Background Processing**: Uses uploaded or predefined background
3. **Text Overlay**: Adds Arabic verse and English translation using FFmpeg
4. **Video Creation**: Combines audio and visual elements
5. **Output**: Generates MP4 file with H.264 encoding

### File Structure

```
adkhar-app/
├── server.js                 # Main server with video generation API
├── package.json             # Dependencies including FFmpeg
├── img/backgrounds/         # Background images
├── generated/               # Generated videos (created automatically)
├── uploads/                 # Uploaded custom backgrounds
├── temp/                    # Temporary files during processing
└── js/main.js              # Frontend video generation logic
```

### Error Handling

- Validates all required parameters
- Handles FFmpeg errors gracefully
- Provides user-friendly error messages
- Cleans up temporary files

### Performance Considerations

- Videos are generated on-demand
- Temporary files are cleaned up automatically
- Generated videos are cached for 24 hours
- Background images are optimized for video processing

## Customization

### Adding New Reciters

1. Update the reciters array in `server.js`
2. Ensure audio URLs are available
3. Test with sample verses

### Adding New Backgrounds

1. Add image to `img/backgrounds/`
2. Update backgrounds array in `server.js`
3. Restart server

### Modifying Video Settings

Edit the FFmpeg command in `server.js` to change:
- Video quality
- Audio settings
- Text positioning
- Video duration

## Troubleshooting

### Common Issues

1. **FFmpeg not found**: Install FFmpeg and update path in server.js
2. **Audio download fails**: Check internet connection and API availability
3. **Video generation fails**: Check FFmpeg installation and file permissions
4. **Background images not loading**: Ensure images exist in correct directory

### Debug Mode

Enable debug logging by adding to server.js:
```javascript
ffmpeg.setFfmpegPath('path/to/ffmpeg');
ffmpeg.setFfprobePath('path/to/ffprobe');
```

## Security Considerations

- File upload validation
- Temporary file cleanup
- Rate limiting (recommended for production)
- Input sanitization

## Production Deployment

For production use:

1. **Environment Variables**: Set PORT and other configs
2. **File Storage**: Use cloud storage for videos
3. **CDN**: Serve static files via CDN
4. **Monitoring**: Add logging and monitoring
5. **Rate Limiting**: Implement request throttling
6. **SSL**: Use HTTPS for secure file transfers

## License

This feature is part of the SakinahTime app and follows the same license terms. 