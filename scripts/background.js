// All streamed video file extensions
const videoFormats = [
    ".m3u8", ".mp4", ".mpd", ".flv", ".ts",
    ".mkv", ".avi", ".hevc", ".h265", ".mov", ".wmv", ".3gp"
];

// Listen for mention of file extension
chrome.webRequest.onCompleted.addListener(
    function (details) {
        if (videoFormats.some(format => details.url.includes(format))) {
            const format = videoFormats.find(format => details.url.includes(format));
            chrome.storage.local.get({ logs: [] }, function (data) {
                let logs = data.logs;
                logs.push([details.url, format]);
                logs = [...new Set(logs)]; // Remove duplicates
                chrome.storage.local.set({ logs });
            });
        }
    },
    { urls: ["<all_urls>"] }
);