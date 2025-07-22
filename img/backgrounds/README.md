# Background Images for Video Generation

This directory should contain background images for the Quran video generation feature.

## Required Images

The following images should be placed in this directory:

1. `mosque_1.jpg` - Beautiful mosque background
2. `kaaba.jpg` - Kaaba background
3. `medina.jpg` - Medina background
4. `nature.jpg` - Nature/landscape background
5. `geometric.jpg` - Geometric Islamic pattern background
6. `gradient.jpg` - Gradient background

## Image Specifications

- **Format**: JPG or PNG
- **Resolution**: 1920x1080 (16:9 aspect ratio) or higher
- **File Size**: Keep under 2MB per image for optimal performance
- **Quality**: High quality, suitable for video backgrounds

## Usage

These images are used as backgrounds for generated Quran videos. Users can select from these predefined backgrounds or upload their own custom images.

## Adding New Backgrounds

To add new backgrounds:

1. Add the image file to this directory
2. Update the backgrounds list in `server.js` (line ~60)
3. The image will automatically appear in the video generator interface

## Notes

- Images should be appropriate for Islamic content
- Avoid images with text or busy patterns that might interfere with Quran text overlay
- Ensure images have good contrast for text readability 