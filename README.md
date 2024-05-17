# BulkCrop

BulkCrop is a desktop application built with Electron that allows you to crop multiple images at once using popular aspect ratios. It provides a user-friendly interface for dragging and dropping images, selecting aspect ratios, and cropping images efficiently.

## Features

- Drag and drop images for batch cropping.
- Select from popular aspect ratios such as 16:9, 4:3, and 1:1.
- Crop multiple images simultaneously.
- Save cropped images to a specified directory.

## Installation

To use BulkCrop, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Run `npm install` to install dependencies.
4. Run `npm start` to launch the application.

## Usage

- Drag and drop images into the application window.
- Select an aspect ratio from the dropdown menu.
- Click the "Crop Image" button to crop all uploaded images according to the selected aspect ratio.
- Cropped images will be saved to the default output directory.

## Configuration

You can configure the default output directory and other settings in the `package.json` file under the `build` configuration section.

## Technologies Used

- Electron: for building cross-platform desktop applications using web technologies.
- Sharp: for high-performance image processing in Node.js.

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvement, please open an issue or submit a pull request.
