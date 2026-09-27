const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'assets', 'vexma');
const validExts = new Set(['.jpg', '.jpeg', '.webp', '.png', '.gif', '.mp4', '.webm']);

function getFiles(dirPath, files = []) {
    if (!fs.existsSync(dirPath)) return files;
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            getFiles(fullPath, files);
        } else {
            const ext = path.extname(item).toLowerCase();
            if (validExts.has(ext)) {
                // Convert backslash to forward slash for web
                const relPath = path.relative(path.join(__dirname), fullPath).replace(/\\/g, '/');
                files.push(relPath);
            }
        }
    }
    return files;
}

const manifest = {
    brochures: getFiles(path.join(baseDir, 'brochure')),
    newsletters: getFiles(path.join(baseDir, 'newsletter')),
    carousels: getFiles(path.join(baseDir, 'caraousel')),
    displayAds: getFiles(path.join(baseDir, 'Displayads')),
    socialPosts: [
        ...getFiles(path.join(baseDir, 'Post')),
        ...getFiles(path.join(baseDir, 'socialmedia'))
    ],
    projects: getFiles(path.join(baseDir, 'project')),
    videos: getFiles(path.join(baseDir, 'vexmavideo'))
};

const fileContent = `const VEXMA_ASSETS = ${JSON.stringify(manifest, null, 4)};\n`;
fs.writeFileSync(path.join(__dirname, 'assets', 'js', 'vexma_assets.js'), fileContent, 'utf-8');
console.log('Successfully generated assets/js/vexma_assets.js');
