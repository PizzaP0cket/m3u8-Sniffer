document.addEventListener("DOMContentLoaded", () => {
    const items = document.getElementById("items");
    const clearBtn = document.getElementById("clear");

    function updateList() {
        chrome.storage.local.get("logs", function (data) {
            items.innerHTML = ""; // Clear current items

            // Loop through logs and display each one
            (data.logs || []).forEach((url, i) => {

                // Create the container for each item
                const itemContainer = document.createElement('div');
                itemContainer.className = 'items';

                // Create and configure the name element
                //const itemName = document.createElement('span');
                //itemName.textContent = 'Name: Test for now'; // Default label (can be replaced with a more dynamic name)
                //itemName.style.display = "block";

                const nameDiv = document.createElement('div');
                nameDiv.style.flex = '1';

                // Create and configure the URL element
                const itemURL = document.createElement('span');
                itemURL.textContent = url.length > 30 ? url.slice(0, 43) + '...' : url;

                const buttonDiv = document.createElement('div');

                // Create and configure the Button element
                const itemButton = document.createElement('button');
                itemButton.className = "itemButton";
                itemButton.textContent = 'C';
                // When clicked - copy to clipboard
                itemButton.addEventListener("click", () => {
                    navigator.clipboard.writeText(url);
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
