const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512];
const inputPath = path.join(__dirname, '../public/logo.jpeg');
const outputDir = path.join(__dirname, '../public');

async function generateIcons() {
  console.log('Generating PWA icons...');

  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);

    await sharp(inputPath)
      .resize(size, size, {
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toFile(outputPath);

    console.log(`✓ Generated ${size}x${size} icon`);
  }

  // Also generate apple-touch-icon
  const appleTouchPath = path.join(outputDir, 'apple-touch-icon.png');
  await sharp(inputPath)
    .resize(180, 180, {
      fit: 'cover',
      position: 'center'
    })
    .png()
    .toFile(appleTouchPath);

  console.log('✓ Generated apple-touch-icon.png (180x180)');
  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
