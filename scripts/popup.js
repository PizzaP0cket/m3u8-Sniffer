document.addEventListener("DOMContentLoaded", () => {
    const clearBtn = document.getElementById("clear");

    const dummyData = [["https://i.pinimg.com/736x/53/76/31/53763136436d736e99c915f41f0ce25d.jpg", ".jpg"],
    ["https://test.json", ".json"], ["https://test.json", ".json"], ["https://test.json", ".json"], ["https://test.json", ".json"], ["https://test.json", ".json"],
    ["https://test.gif", ".gif"], ["https://test.xls", ".xls"], ["https://test.doc", ".doc"], ["https://test.ppt", ".ppt"], ["https://test.csv", ".csv"], ["https://test.csv", ".csv"]]

    function updateList() {
        chrome.storage.local.get("logs", function (data) {
            // Loop through logs and display each one
            (data.logs || []).forEach((media, i) => {
                //(dummyData).forEach((media, i) => {

                let count = data.logs.filter(test => test[1] === media[1]).length;
                const label = document.getElementById(`${media[1]}-label`)
                label.textContent = `${media[1]} (${count})`;

                console.log(`${media[1]} + ${count}`)
                if (media[0].includes(".jpg") || media[0].includes(".jpeg") || media[0].includes(".png") || media[0].includes(".gif") || media[0].includes(".webp") || media[0].includes(".bmp") || media[0].includes(".svg") || media[0].includes(".tiff")) {
                    addImageMedia(media, i);
                } else {
                    addFileMedia(media, i);
                }
            });
        });
    }

    // Clear button handler
    clearBtn.addEventListener("click", () => {
        chrome.storage.local.set({ logs: [] }, updateList); // Reset logs and update list
    });

    // Delete item from logs
    function deleteItem(index) {
        chrome.storage.local.get("logs", function (data) {
            // Remove the item from the logs array
            data.logs.splice(index, 1);
            chrome.storage.local.set({ logs: data.logs }, updateList); // Set logs and update list
        });
    }

    // Add Image Media formatting
    function addImageMedia(imageMedia, index) {
        const items = document.getElementById(`${imageMedia[1]}-container`);

        let mediaItem = document.createElement('div');
        mediaItem.id = `media-${imageMedia[0]}`;

        // Define the URL or media source
        let itemURL = `<img src="${imageMedia[0]}" class="media-image" />`;

        let formatLabel = `<span class="format-label">${imageMedia[1]}</span>`;

        mediaItem.innerHTML = `
        <div class="nameDiv" style="display:inline;">
            ${itemURL}
            <div style='display:flex; margin-top:-20px; position:absolute'>
                ${formatLabel}
                <button class='copyButton'>c</button>
                <button class='deleteButton'>x</button>
            </div>
        </div>
        </div>`;

        // Add event listeners for copy and delete buttons
        addEventListeners(mediaItem, imageMedia, index);

        items.appendChild(mediaItem);
    }

    // Add File Media formatting
    function addFileMedia(fileMedia, index) {
        const items = document.getElementById(`${fileMedia[1]}-container`);

        let mediaItem = document.createElement('div');
        mediaItem.className = `media-item ${fileMedia[0]}`;

        // Define the URL or media source
        let itemURL = `<span>${fileMedia[0].length > 30 ? fileMedia[0].slice(0, 43) + '...' : fileMedia[0]}</span>`;

        mediaItem.innerHTML = `
        <div class="nameDiv" style="display: inline-flex; padding-left: 5px;">
            ${itemURL}
            <div style='display:flex;'>
                <button class='copyButton'>c</button>
                <button class='deleteButton'>x</button>
            </div>
        </div>`;

        // Add event listeners for copy and delete buttons
        addEventListeners(mediaItem, fileMedia, index);

        items.appendChild(mediaItem);
    }

    // Helper function to add event listeners for copy and delete buttons
    function addEventListeners(mediaItem, media, index) {
        // COPY BUTTON
        let copyButton = mediaItem.querySelector('.copyButton');
        copyButton.addEventListener("click", () => {
            navigator.clipboard.writeText(media[0]);
        });

        // DELETE BUTTON
        let deleteButton = mediaItem.querySelector('.deleteButton');
        deleteButton.addEventListener("click", () => {
            deleteItem(index);
            updateList();
        });
    }

    // Initial load of the logs
    updateList();



    const videoFormats = [
        // Video Files
        ".mp4",   // MPEG-4 Video
        ".webm",  // WebM Video
        ".ogv",   // Ogg Video
        ".avi",   // Audio Video Interleave
        ".mov",   // QuickTime Movie
        ".flv",   // Flash Video
        ".mkv",   // Matroska Video
        ".3gp",   // 3GPP Video
        ".m3u8",  // HLS Playlist

        // Audio Files
        ".mp3",   // MP3 Audio
        ".wav",   // Waveform Audio
        ".ogg",   // Ogg Audio
        ".flac",  // Free Lossless Audio Codec
        ".aac",   // Advanced Audio Codec
        ".m4a",   // MPEG-4 Audio
        ".wma",   // Windows Media Audio

        // Image Files
        ".jpg",   // JPEG Image
        ".jpeg",  // JPEG Image
        ".png",   // Portable Network Graphics
        ".gif",   // Graphics Interchange Format
        ".webp",  // WebP Image
        ".bmp",   // Bitmap Image
        ".svg",   // Scalable Vector Graphics
        ".tiff",  // Tagged Image File Format

        // Document Files
        ".pdf",   // Portable Document Format
        ".doc",   // Microsoft Word Document
        ".docx",  // Microsoft Word Document
        ".xls",   // Microsoft Excel Spreadsheet
        ".xlsx",  // Microsoft Excel Spreadsheet
        ".ppt",   // Microsoft PowerPoint Presentation
        ".pptx",  // Microsoft PowerPoint Presentation
        ".txt",   // Plain Text File
        ".csv",   // Comma-Separated Values

        // Web-related Files
        ".json",  // JSON Data
        ".xml",   // XML File
        ".jsonld",// JSON Linked Data

        // Compressed Files
        ".zip",   // ZIP Archive
        ".tar",   // Tape Archive
        ".gz",    // Gzip Compressed Archive
        ".rar",   // RAR Archive
        ".7z",    // 7-Zip Archive

        // Miscellaneous
        ".exe",   // Executable File
        ".dmg",   // Apple Disk Image
    ];

    // Loop through the array
    videoFormats.forEach(function (mediaID) {
        // Add event listener to each p element
        document.getElementById(`${mediaID}-label`).addEventListener('click', function () {
            let element = document.getElementById(`${mediaID}-container`)
            element.style.display == 'none' ? element.style.display = 'flex' : element.style.display = 'none';
        });
    });


});

