const { ipcRenderer } = require('electron');
const sharp = require('sharp');

document.addEventListener('DOMContentLoaded', () => {
  const dropArea = document.getElementById('drop-area');
  const fileInput = document.getElementById('fileElem');
  const statusElement = document.getElementById('status');
  const fileListElement = document.getElementById('file-list');
  const aspectRatioSelect = document.getElementById('aspect-ratio');
  const cropButton = document.getElementById('crop-button');
  let files = [];

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => {
      dropArea.classList.add('hover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => {
      dropArea.classList.remove('hover');
    }, false);
  });

  dropArea.addEventListener('drop', handleDrop, false);

  function handleDrop(e) {
    const dt = e.dataTransfer;
    files = dt.files;
    handleFiles(files);
  }

  fileInput.addEventListener('change', (e) => {
    files = e.target.files;
    handleFiles(files);
  });

  function handleFiles(files) {
    statusElement.innerText = `${files.length} image(s) uploaded.`;

    fileListElement.innerHTML = '';
    const fileList = document.createElement('ul');
    fileList.style.listStyle = 'none';
    fileList.style.padding = '0';

    for (let i = 0; i < files.length; i++) {
      const listItem = document.createElement('li');
      listItem.textContent = files[i].name;
      fileList.appendChild(listItem);
    }

    fileListElement.appendChild(fileList);
  }

  async function cropAndSaveImages(images) {
    try {
      const savedImages = await ipcRenderer.invoke('save-cropped-images', images);
      console.log('All images cropped and saved:', savedImages);
      alert(`${savedImages.length} images cropped and saved successfully.`);
    } catch (error) {
      console.error('Error cropping and saving images:', error);
      alert('Error cropping and saving images. Please check the console for details.');
    }
  }

  cropButton.addEventListener('click', () => {
    const selectedAspectRatio = aspectRatioSelect.value;
    if (!selectedAspectRatio) {
      alert('Please select an aspect ratio before cropping.');
      return;
    }

    if (files.length === 0) {
      alert('No images uploaded.');
      return;
    }

    const images = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (event) => {
        console.log('Image loaded, starting crop...');
        images.push({ fileBuffer: event.target.result, aspectRatio: selectedAspectRatio, fileName: file.name });

        // If all images are loaded, crop and save them
        if (images.length === files.length) {
          cropAndSaveImages(images);
        }
      };

      reader.readAsArrayBuffer(file);
    }
  });
});
