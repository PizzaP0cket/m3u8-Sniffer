document.addEventListener("DOMContentLoaded", () => {
    const items = document.getElementById("items");
    const clearBtn = document.getElementById("clear");

    const dummyData = [["https://i.pinimg.com/736x/53/76/31/53763136436d736e99c915f41f0ce25d.jpg", ".jpg"], ["https://i.pinimg.com/236x/ff/bc/cc/ffbccc213dde2864a9f6ef2c53d0792a.jpg", ".jpg"], ["https://i.pinimg.com/236x/d5/fb/72/d5fb72d4087711eca5ff118df9181c49.jpg", ".jpg"], ["https://i.ytimg.com/vi/N9J2s630mUU/mqdefault.jpg?sqp=-oaymwEFCJQBEFM&rs=AMzJL3mUyKPlRjf34MQv3Qz3tShaH1Jwzg", ".jpg"], ["https://www.google.com/images/searchbox/desktop_searchbox_sprites318_hr.webp", ".webp"], ["https://www.google.com/images/nav_logo321.webp", ".webp"], ["https://www.gstatic.com/images/branding/product/1x/youtube_32dp.png", ".png"], ["https://www.google.com/images/nav_logo321_hr.webp", ".webp"], ["https://cdn.sstatic.net/Img/favicons-sprite16.png?v=eb322c33ef18", ".png"], ["https://ssl.gstatic.com/gb/images/sprites/p_2x_72023649b67c.png", ".png"], ["https://www.google.com/images/phd/px.gif", ".gif"], ["https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi3.svg", ".svg"]]

    function updateList() {
        chrome.storage.local.get("logs", function (data) {
            items.innerHTML = ""; // Clear current items

            // Loop through logs and display each one
            //(data.logs || []).forEach((media, i) => {
            (dummyData).forEach((media, i) => {
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
            <div style='display:flex; margin-top:-15px; position:absolute'>
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

        let formatLabel = `<span class="format-label">${fileMedia[1]}</span>`;

        mediaItem.innerHTML = `
        <div class="nameDiv" style="flex: 1;">
            ${itemURL}
            <div style='display:flex; margin-top:-15px; position:absolute'>
                ${formatLabel}
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
        });
    }

    // Initial load of the logs
    updateList();
});
