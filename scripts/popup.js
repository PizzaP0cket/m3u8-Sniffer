document.addEventListener("DOMContentLoaded", () => {
    const itemContainer = document.getElementById("items");
    const clearBtn = document.getElementById("clear");
    let fileTypesUsed = new Set();

    const storage = (typeof browser !== "undefined" ? browser : chrome).storage.local;

    function updateList() {
        storage.get(["logs", "folderStates"], (data) => {
            itemContainer.innerHTML = '';
            //fileTypesUsed.clear();
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

                //if (ty.includes(".jpg") || url.includes(".jpeg") || url.includes(".png") || url.includes(".gif") || url.includes(".webp") || url.includes(".bmp") || url.includes(".svg") || url.includes(".tiff")) {
                if (url.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg|tiff)$/)) {
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
                    deleteItem(i, type);
                });

                fileTypeItem.appendChild(mediaItem);

            });
        });
    }

    // TO DO: Still having issues with this one
    function deleteItem(index) {
        storage.get("logs", (data) => {
            data.logs.splice(index, 1);
            storage.set({ logs: data.logs }, () => {
                updateList();
            });
        });
    }

    // Clear button handler
    clearBtn.addEventListener("click", () => {
        storage.set({ logs: [], folderStates: {} }, updateList);
    });

    updateList();

});