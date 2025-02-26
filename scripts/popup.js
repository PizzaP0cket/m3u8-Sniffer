document.addEventListener("DOMContentLoaded", () => {
    const items = document.getElementById("items");
    const clearBtn = document.getElementById("clear");

    const dummyData = [["https://i.pinimg.com/736x/53/76/31/53763136436d736e99c915f41f0ce25d.jpg", ".jpg"], ["https://i.pinimg.com/236x/ff/bc/cc/ffbccc213dde2864a9f6ef2c53d0792a.jpg", ".jpg"], ["https://i.pinimg.com/236x/d5/fb/72/d5fb72d4087711eca5ff118df9181c49.jpg", ".jpg"]
        //    , ["https://i.ytimg.com/vi/N9J2s630mUU/mqdefault.jpg?sqp=-oaymwEFCJQBEFM&rs=AMzJL3mUyKPlRjf34MQv3Qz3tShaH1Jwzg", ".jpg"], ["https://www.google.com/images/searchbox/desktop_searchbox_sprites318_hr.webp", ".webp"], ["https://www.google.com/images/nav_logo321.webp", ".webp"], ["https://www.gstatic.com/images/branding/product/1x/youtube_32dp.png", ".png"], ["https://www.google.com/images/nav_logo321_hr.webp", ".webp"], ["https://cdn.sstatic.net/Img/favicons-sprite16.png?v=eb322c33ef18", ".png"], ["https://ssl.gstatic.com/gb/images/sprites/p_2x_72023649b67c.png", ".png"], ["https://www.google.com/images/phd/px.gif", ".gif"], ["https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi3.svg", ".svg"]
    ]

    function updateList() {
        chrome.storage.local.get("logs", function (data) {
            items.innerHTML = ""; // Clear current items

            // Loop through logs and display each one
            (data.logs || []).forEach((media, i) => {
                //(dummyData).forEach((media, i) => {

                // Create the container for each item
                const itemContainer = document.createElement('div');
                itemContainer.className = 'items';

                // Define the URL or media source
                let itemURL = '';
                if (media[0].includes('.png') || media[0].includes('.jpg') || media[1].includes('.svg')) {
                    itemURL = `<img src="${media[0]}" class="media-image"">`;
                } else {
                    itemURL = `<span>${media[0].length > 30 ? media[0].slice(0, 43) + '...' : media[0]}</span>`;
                }
                const formatLabel = `<span class="format-label">${media[1]}</span>`;

                itemContainer.innerHTML = `
                <div class="nameDiv" style="flex: 1;">
                ${itemURL}
                <div style='display:flex; margin-top:-15px; position:absolute'>
                    ${formatLabel}
                    <button class='copyButton', id='copyButton'>c</button>
                    <button class='deleteButton' id='deleteButton'>x</button>
                <div>
                </div>`

                //margin-top: -15px;
                //position: absolute;

                // COPY BUTTON
                const copyButton = itemContainer.querySelector('.copyButton');
                copyButton.addEventListener("click", () => {
                    navigator.clipboard.writeText(media[0]);
                })

                // DELETE BUTTON
                const deleteButton = itemContainer.querySelector('.deleteButton');
                deleteButton.addEventListener("click", () => {
                    deleteItem(i)
                });

                items.appendChild(itemContainer);
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

    // Initial load of the logs
    updateList();
});
