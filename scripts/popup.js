document.addEventListener("DOMContentLoaded", () => {
    const itemContainer = document.getElementById("items");
    const clearBtn = document.getElementById("clear");
    let fileTypesUsed = new Set();

    const storage = (typeof browser !== "undefined" ? browser : chrome).storage.local;

    function updateList() {
        storage.get(["logs", "folderStates"], (data) => {
            itemContainer.innerHTML = '';
            fileTypesUsed.clear();
            let folderStates = data.folderStates || {};
            // Loop through logs and display each one
            (data.logs || []).forEach((media, i) => {

                let [url, type] = media;
                fileTypesUsed.add(type);

                let fileTypeContainer = document.getElementById(type);
                //let fileTypeItem;
                let isNewType = false;

                // get the file type div
                // if it doesn't exist -> create a new div
                if (!fileTypeContainer) {
                    fileTypeContainer = document.createElement('div');
                    fileTypeContainer.id = type;
                    let isOpen = folderStates[type] || false;

                    fileTypeContainer.innerHTML = `
                    <div class='file-type' id="file-type-${type}">
                        <div>
                            <span>${type}</span>
                            <span id="${type}-count">(0)</span>
                        </div>
                        <div style="padding-right: 5px;">
                            <span id="toggle-${type}">${isOpen ? '-' : '+'}</span>
                        </div>
                    </div>
                    <div id="${type}-items" style="display: ${isOpen ? '' : 'none'};">
                    </div>`;
                    itemContainer.appendChild(fileTypeContainer)
                    isNewType = true;
                }

                const fileTypeItem = document.getElementById(`${type}-items`);

                if (isNewType) {
                    document.getElementById(`file-type-${type}`).addEventListener("click", () => {
                        let isOpen = fileTypeItem.style.display === "";
                        fileTypeItem.style.display = isOpen ? "none" : "";
                        document.getElementById(`toggle-${type}`).textContent = isOpen ? '+' : '-';
                        folderStates[type] = !isOpen;
                        storage.set({ folderStates });
                    });
                }

                // Count how many files there are for each file type
                let count = data.logs.filter(test => test[1] === type).length;
                document.getElementById(`${type}-count`).textContent = `(${count})`;

                let mediaItem = document.createElement('div');
                mediaItem.id = `media-item-${url}`;

                if (url.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg|tiff)/)) {
                    fileTypeItem.className = 'image-Container'
                    mediaItem.innerHTML = `
                    <div class="item-image" style="position: relative;">
                        <img src="${url}" class="media-image" id="media-${url}" />
                        <div style="display: flex; margin-top: -20px; position: absolute;">
                        <div class="format-label">
                            <span>${type}</span>
                        </div>
                                <button class="copyButton">c</button>
                                <button class="deleteButton">x</button>
                        </div>
                    </div>`;
                } else {
                    mediaItem.innerHTML = `
                    <div class="item">
                        <div class="url">
                            <span>- ${url}</span>
                        </div>
                        <div style='display:flex;'>
                            <button class='copyButton'>c</button>
                            <button class='deleteButton'>x</button>
                        </div>
                    </div>`;
                }

                // COPY BUTTON
                mediaItem.querySelector('.copyButton').addEventListener("click", () => {
                    navigator.clipboard.writeText(url);
                });

                // DELETE BUTTON
                mediaItem.querySelector('.deleteButton').addEventListener("click", () => {
                    deleteItem(url, type);
                });


                fileTypeItem.appendChild(mediaItem);

            });
        });
    }

    // Delete item from list
    function deleteItem(url, type) {
        storage.get("logs", (data) => {
            let logs = data.logs || [];

            // Find the index of the item by matching the URL
            let index = logs.findIndex(item => item[0] === url);
            if (index === -1) return; // If not found, exit

            logs.splice(index, 1); // Remove item from logs

            storage.set({ logs }, () => {
                // Remove the specific media item from the DOM
                const mediaItem = document.getElementById(`media-item-${url}`);
                if (mediaItem) {
                    mediaItem.remove();
                }

                // Update count
                let count = logs.filter(item => item[1] === type).length;
                const countElement = document.getElementById(`${type}-count`);
                if (countElement) {
                    countElement.textContent = `(${count})`;
                }

                // If no more items of this type exist, remove the whole file type container
                if (count === 0) {
                    document.getElementById(type)?.remove();
                }
            });
        });
    }

    // Clear button handler
    clearBtn.addEventListener("click", () => {
        storage.set({ logs: [], folderStates: {} }, updateList);
    });

    updateList();

});

// All streamed video file extensions
const fileFormat = new Set([    // Video Files
    ".mp4",   // MPEG-4 Video
    ".webm",  // WebM Video
    ".ogv",   // Ogg Video
    ".avi",   // Audio Video Interleave
    ".mov",   // QuickTime Movie
    ".flv",   // Flash Video
    ".mkv",   // Matroska Video
    ".3gp",   // 3GPP Video
    ".m3u8",  // HLS Playlist
    ".hls",   // HLS Stream

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
]);

document.getElementById("settings").addEventListener("click", () => {
    const settingsContainer = document.getElementById("checkboxes");
    const list = document.getElementById("list");
    const itemsContainer = document.getElementById("items");

    // Toggle the visibility of settingsContainer and itemsContainer
    settingsContainer.style.display = settingsContainer.style.display === "block" ? "none" : "block";
    itemsContainer.style.display = itemsContainer.style.display === "" ? "none" : "";

    // Only append checkboxes if they haven't been added yet
    if (list.children.length === 0) {
        // Fetch the checked files from storage
        const storage = (typeof browser !== "undefined" ? browser : chrome).storage.local;
        storage.get('checkedFiles', (data) => {
            const checkedFiles = data.checkedFiles || [];
            fileFormat.forEach(format => {
                const fileCheckBox = document.createElement('div');
                fileCheckBox.innerHTML = `<li><input type="checkbox" id="checkbox-${format}" data-format="${format}"><label for="${format}"><b>${format}</b></label></li>`;
                list.appendChild(fileCheckBox);

                // Find if this format is in the checkedFiles array and set the checkbox state
                const storedState = checkedFiles.find(item => item[0] === format);
                const isChecked = storedState ? storedState[1] === 'checked' : false;
                document.getElementById(`checkbox-${format}`).checked = isChecked;
            });
        });
    }
});

// Event listener to save checkbox state in localStorage
document.getElementById("list").addEventListener("change", (event) => {
    const storage = (typeof browser !== "undefined" ? browser : chrome).storage.local;

    if (event.target.type === 'checkbox') {
        const format = event.target.getAttribute('data-format');
        const isChecked = event.target.checked ? 'checked' : 'unchecked'; // 'checked' or 'unchecked'

        // Retrieve the existing checkedFiles array from storage
        storage.get('checkedFiles', (data) => {
            let checkedFiles = data.checkedFiles || [];  // If no data exists, initialize as empty array
            // Check if the format already exists
            const existingIndex = checkedFiles.findIndex(item => item[0] === format);
            if (existingIndex !== -1) {
                // Update the state of the existing format
                checkedFiles[existingIndex] = [format, isChecked];
            } else {
                // Add the new format and its checked state to the array
                checkedFiles.push([format, isChecked]);
            }
            // Save the updated checkedFiles array back to storage
            storage.set({ checkedFiles: checkedFiles });
        });
    }
});
