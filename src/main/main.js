const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

//const defaultSavePath = path.join(__dirname, '..', '..', 'cropped'); // Define the save directory

// Set the default save path to 'cropped' directory under desktop
const desktopPath = app.getPath('desktop');
const defaultSavePath = path.join(desktopPath, 'cropped');

// Ensure the 'cropped' directory exists, create it if it doesn't
if (!fs.existsSync(defaultSavePath)) {
  fs.mkdirSync(defaultSavePath);
}

function generateUniqueFileName(fileName, extension) {
  const croppedFileName = `${fileName}_crop`;
  return `${croppedFileName}.${extension}`;
}


let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  //mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  mainWindow.loadFile('src\\renderer\\index.html');
});

ipcMain.handle('save-cropped-images', async (event, images) => {
  const savedImages = [];
  for (const image of images) {
    const { fileBuffer, aspectRatio, fileName } = image;
    try {
      const imageBuffer = Buffer.from(fileBuffer);
      const image = sharp(imageBuffer);
      const metadata = await image.metadata();
      const imageWidth = metadata.width;
      const imageHeight = metadata.height;

      let cropWidth, cropHeight;
      if (aspectRatio === '16:9') {
        cropWidth = Math.round(imageHeight * 16 / 9);
        cropHeight = Math.round(imageWidth * 9 / 16);
      } else if (aspectRatio === '4:3') {
        cropWidth = Math.round(imageHeight * 4 / 3);
        cropHeight = Math.round(imageWidth * 3 / 4);
      } else if (aspectRatio === '1:1') {
        cropWidth = cropHeight = Math.min(imageWidth, imageHeight);
      }

      const cropOptions = {
        left: 0,
        top: Math.max(0, Math.floor((imageHeight - cropHeight) / 2)),
        width: cropWidth,
        height: Math.min(cropHeight, imageHeight)
      };

      const croppedImageBuffer = await image.extract(cropOptions).toBuffer();
      const originalFileName = path.parse(fileName).name; // Extract filename without extension
      const saveFileName = generateUniqueFileName(originalFileName, 'png');
      const savePath = path.join(defaultSavePath, saveFileName);
      fs.writeFileSync(savePath, croppedImageBuffer);

      savedImages.push({ fileName, savePath });
    } catch (error) {
      console.error(`Error cropping image '${fileName}':`, error);
    }
  }

  return savedImages;
});
