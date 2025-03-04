// All streamed video file extensions
const fileFormat = new Set([    // Video Files
    ".mp4",   // MPEG-4 Video
    ".webm",  // WebM Video
    ".ogv",   // Ogg Video
    ".avi",   // Audio Video Interleave
    ".mov",   // QuickTime Movie
    ".flv",   // Flash Video
    ".mkv",   // Matroska Video
    ".3gp",   // 3GPP Video
    ".m3u8",  // HLS Playlist
    ".hls",   // HLS Stream

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
]);

const storage = typeof browser !== "undefined" ? browser.storage.local : chrome.storage.local;

storage.webRequest.onCompleted.addListener(
    async (details) => {
        try {
            const url = new URL(details.url.toLowerCase());
            const format = [...fileFormat].find(ext => url.pathname.includes(ext));

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