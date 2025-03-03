// All streamed video file extensions
const videoFormats = [
    // Video Files
    ".mp4",   // MPEG-4 Video
    ".webm",  // WebM Video
    ".ogv",   // Ogg Video
    ".avi",   // Audio Video Interleave
    ".mov",   // QuickTime Movie
    ".flv",   // Flash Video
    ".mkv",   // Matroska Video
    ".3gp",   // 3GPP Video
    ".m3u8",  // HLS Playlist

    // Audio Files
    ".mp3",   // MP3 Audio
    ".wav",   // Waveform Audio
    ".ogg",   // Ogg Audio
    ".flac",  // Free Lossless Audio Codec
    ".aac",   // Advanced Audio Codec
    ".m4a",   // MPEG-4 Audio
    ".wma",   // Windows Media Audio

    // Image Files
    ".jpg",   // JPEG Image
    ".jpeg",  // JPEG Image
    ".png",   // Portable Network Graphics
    ".gif",   // Graphics Interchange Format
    ".webp",  // WebP Image
    ".bmp",   // Bitmap Image
    ".svg",   // Scalable Vector Graphics
    ".tiff",  // Tagged Image File Format

    // Document Files
    ".pdf",   // Portable Document Format
    ".doc",   // Microsoft Word Document
    ".docx",  // Microsoft Word Document
    ".xls",   // Microsoft Excel Spreadsheet
    ".xlsx",  // Microsoft Excel Spreadsheet
    ".ppt",   // Microsoft PowerPoint Presentation
    ".pptx",  // Microsoft PowerPoint Presentation
    ".txt",   // Plain Text File
    ".csv",   // Comma-Separated Values

    // Web-related Files
    ".json",  // JSON Data
    ".xml",   // XML File
    ".jsonld",// JSON Linked Data

    // Compressed Files
    ".zip",   // ZIP Archive
    ".tar",   // Tape Archive
    ".gz",    // Gzip Compressed Archive
    ".rar",   // RAR Archive
    ".7z",    // 7-Zip Archive

    // Miscellaneous
    ".exe",   // Executable File
    ".dmg",   // Apple Disk Image
];


// Listen for mention of file extension
chrome.webRequest.onCompleted.addListener(
    function (details) {
        if (videoFormats.some(format => details.url.includes(format))) {
            const format = videoFormats.find(format => details.url.includes(format));
            chrome.storage.local.get({ logs: [] }, function (data) {
                let logs = data.logs;
                logs.push([details.url, format]);
                // Remove duplicates
                logs = [...new Set(logs.map(log => log[0]))].map(url => {
                    return logs.find(log => log[0] === url);
                });
                //logs = [...new Set(logs)]; // Remove duplicates
                chrome.storage.local.set({ logs });
            });
        }
    },
    { urls: ["<all_urls>"] }
);

