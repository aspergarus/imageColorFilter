const fileInput = document.getElementById('fileInput');
const redInput = document.getElementById('red');
const greenInput = document.getElementById('green');
const blueInput = document.getElementById('blue');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let originalImageData = null; // Store the original image data

fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height); // Store original data
                applyColorFilter(); // Apply initial filter
            }
            img.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});

function applyColorFilter() {
    const red = parseInt(redInput.value);
    const green = parseInt(greenInput.value);
    const blue = parseInt(blueInput.value);

    if (originalImageData) {
        const imageData = new ImageData(new Uint8ClampedArray(originalImageData.data), originalImageData.width, originalImageData.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            let avg = (data[i] + data[i+1] + data[i+2]) / 3;

            // data[i] = (data[i] + red) / 2;     // Red channel
            // data[i + 1] = (data[i + 1] + green) / 2; // Green channel
            // data[i + 2] = (data[i + 2] + blue) / 2;   // Blue channel
            // Alpha channel (data[i + 3]) remains unchanged

            data[i + 0] = avg * (red / 255);     // Red channel
            data[i + 1] = avg * (green / 255); // Green channel
            data[i + 2] = avg * (blue / 255);   // Blue channel
        }

        ctx.putImageData(imageData, 0, 0);
    }
}

// Attach event listeners for color input changes
redInput.addEventListener('input', applyColorFilter);
greenInput.addEventListener('input', applyColorFilter);
blueInput.addEventListener('input', applyColorFilter);
