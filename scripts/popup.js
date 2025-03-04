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