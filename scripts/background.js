// All streamed video file extensions

let fileFormat = [];

// Detect which storage API to use
const storage = typeof browser !== "undefined" ? browser.storage.local : chrome.storage.local;

function checkFiles() {
    storage.get(['logs', 'checkedFiles'], function (result) {
        fileFormat = [];
        for (i in result.checkedFiles) {
            if (!fileFormat.includes(result.checkedFiles[i][0]) && result.checkedFiles[i][1] == 'checked') {
                fileFormat.push(result.checkedFiles[i][0])
            }
        }
        console.log('Final: ' + fileFormat)
    })
}

// Handle webRequest event for both Chrome and Firefox
if (typeof chrome !== "undefined" && chrome.webRequest) {
    chrome.webRequest.onCompleted.addListener(
        async (details) => {
            try {
                checkFiles()
                const url = new URL(details.url.toLowerCase());
                const format = [...fileFormat].find(ext => url.pathname.includes(ext));

                if (!format) return; // Skip if not a video file

                const data = await new Promise((resolve, reject) => {
                    storage.get({ logs: [] }, (result) => {
                        if (chrome.runtime.lastError) {
                            reject(chrome.runtime.lastError);
                        } else {
                            resolve(result);
                        }
                    });
                });

                const logs = new Set(data.logs.map(log => log[0]));

                if (!logs.has(details.url)) {
                    data.logs.push([details.url, format]);
                    await new Promise((resolve, reject) => {
                        storage.set({ logs: data.logs }, () => {
                            if (chrome.runtime.lastError) {
                                reject(chrome.runtime.lastError);
                            } else {
                                resolve();
                            }
                        });
                    });
                }
            } catch (err) {
                console.error("Error processing video URL:", err);
            }
        },
        { urls: ["<all_urls>"] }
    );
} else if (typeof browser !== "undefined" && browser.webRequest) {
    browser.webRequest.onCompleted.addListener(
        async (details) => {
            try {
                checkFiles()
                const url = new URL(details.url.toLowerCase());
                const format = [...fileFormat].find(ext => url.pathname.includes(ext));
                console.log(storage);

                if (!format) return; // Skip if not a video file

                const data = await storage.get({ logs: [] });
                const logs = new Set(data.logs.map(log => log[0]));

                if (!logs.has(details.url)) {
                    data.logs.push([details.url, format]);
                    await storage.set({ logs: data.logs });
                }
            } catch (err) {
                console.error("Error processing video URL:", err);
            }
        },
        { urls: ["<all_urls>"] }
    );
}
