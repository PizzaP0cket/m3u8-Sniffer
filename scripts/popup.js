document.addEventListener("DOMContentLoaded", () => {
    const items = document.getElementById("items");
    const clearBtn = document.getElementById("clear");

    function updateList() {
        chrome.storage.local.get("logs", function (data) {
            items.innerHTML = ""; // Clear current items

            // Loop through logs and display each one
            (data.logs || []).forEach((url) => {

                // Create the container for each item
                const itemContainer = document.createElement('div');
                itemContainer.className = 'items';

                // Create and configure the name element
                const itemName = document.createElement('span');
                itemName.textContent = 'Name: Test for now'; // Default label (can be replaced with a more dynamic name)
                itemName.style.display = "block";

                // Create and configure the URL element
                const itemURL = document.createElement('span');
                itemURL.textContent = url.length > 30 ? url.slice(0, 40) + '...' : url;

                // Create and configure the Button element
                const itemButton = document.createElement('button');
                itemButton.className = "itemButton";
                itemButton.textContent = 'Copy URL';

                // When clicked - copy to clipboard
                itemButton.addEventListener("click", () => {
                    navigator.clipboard.writeText(url);
                })

                // Append both name and URL to the container
                itemContainer.appendChild(itemName);
                itemContainer.appendChild(itemURL);
                itemContainer.appendChild(itemButton);


                // Append the item container to the list
                items.appendChild(itemContainer);
            });
        });
    }

    // Clear button handler
    clearBtn.addEventListener("click", () => {
        chrome.storage.local.set({ logs: [] }, updateList); // Reset logs and update list
    });

    // Initial load of the logs
    updateList();
});
