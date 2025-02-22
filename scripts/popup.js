document.addEventListener("DOMContentLoaded", () => {
    const items = document.getElementById("items");
    const clearBtn = document.getElementById("clear");

    function updateList() {
        chrome.storage.local.get("logs", function (data) {
            items.innerHTML = ""; // Clear current items

            // Loop through logs and display each one
            (data.logs || []).forEach((url) => {

                items.innerHTML += `
                    <div class="items">
                        <span><b>Name:</b> Test for now</span>
                        <span>${url.length > 30 ? url.slice(0, 40) + '...' : url}</span>
                        <button class="itemButton" 
                        onclick="navigator.clipboard.writeText('${url}')">Copy URL</button>
                    </div>
                `;

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
