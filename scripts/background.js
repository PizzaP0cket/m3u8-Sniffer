// All streamed video file extensions
const videoFormats = [
    ".m3u8", ".mp4", ".mpd", ".flv", ".ts",
    ".mkv", ".avi", ".hevc", ".h265", ".mov", ".wmv", ".3gp"
];

// Listen for mention of file extension
chrome.webRequest.onCompleted.addListener(
    function (details) {
        if (videoFormats.some(format => details.url.includes(format))) {
            chrome.storage.local.get({ logs: [] }, function (data) {
                let logs = data.logs;
                logs.push(details.url);
                logs = [...new Set(logs)]; // Remove duplicates
                logs.sort((a, b) => {
                    const getResolution = (url) => {
                        const match = url.match(/(\d{3,4})p/);
                        return match ? parseInt(match[1]) : 0;
                    };
                    return getResolution(b) - getResolution(a);
                });
                chrome.storage.local.set({ logs });
            });
        }
    },
    { urls: ["<all_urls>"] }
);