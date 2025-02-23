document.addEventListener("DOMContentLoaded", () => {
    const items = document.getElementById("items");
    const clearBtn = document.getElementById("clear");

    function updateList() {
        chrome.storage.local.get("logs", function (data) {
            items.innerHTML = ""; // Clear current items

            // Loop through logs and display each one
            (data.logs || []).forEach((media, i) => {

                // Create the container for each item
                const itemContainer = document.createElement('div');
                itemContainer.className = 'items';

                const nameDiv = document.createElement('div');
                nameDiv.style.flex = '1';

                // Create and configure the URL element
                const itemURL = document.createElement('span');
                itemURL.textContent = media[0].length > 30 ? media[0].slice(0, 43) + '...' : media[0];
                const buttonDiv = document.createElement('div');

                // Create and configure the formatLabel element
                const formatLabel = document.createElement('span');
                formatLabel.textContent = media[1] // Default label (can be replaced with a more dynamic name)
                formatLabel.style.display = "block";

                // Create and configure the Button element
                const itemButton = document.createElement('button');
                itemButton.className = "itemButton";
                itemButton.textContent = 'C';
                // When clicked - copy to clipboard
                itemButton.addEventListener("click", () => {
                    navigator.clipboard.writeText(media[0]);
                })

                // Create and configure the Delete Buttom element
                const deleteButton = document.createElement('button');
                deleteButton.className = 'itemButton';
                deleteButton.textContent = 'x';
                // When clicked - delete item from log
                deleteButton.addEventListener("click", () => {
                    deleteItem(i)
                });

                // Append both name and URL to the container
                //itemContainer.appendChild(itemName);
                nameDiv.appendChild(itemURL)
                nameDiv.appendChild(formatLabel);
                itemContainer.appendChild(nameDiv);
                //itemContainer.appendChild(buttonDiv);
                itemContainer.appendChild(itemButton);
                itemContainer.appendChild(deleteButton);

                // Append the item container to the list
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
