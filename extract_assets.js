import fs from 'fs';
import https from 'https';
import path from 'path';

const jsPath = 'C:/Users/Hp/.gemini/antigravity/brain/9d5043fc-7760-46c7-a125-e15d3e386626/.system_generated/steps/350/content.md';
const code = fs.readFileSync(jsPath, 'utf8');

// Extract all strings
console.log('Extracting assets from detaypeyzaj.com.tr bundle...');

// Find all image references, URLs, assets
const assetMatches = code.match(/["'](\/assets\/[^"']+)["']/g) || [];
console.log('Asset paths:', assetMatches);

// Find all http/https image URLs
const urlMatches = code.match(/https?:\/\/[^\s"']+\.(jpg|jpeg|png|webp|svg)/gi) || [];
console.log('Full image URLs:', [...new Set(urlMatches)]);

// Find all text blocks in turkish
const turkishRegex = /["']([A-ZÇĞİÖŞÜa-zçğıöşü0-9\s,.\-!?:;()/%+]{4,100})["']/g;
let match;
const texts = new Set();
while ((match = turkishRegex.exec(code)) !== null) {
  if (match[1].length > 10 && !match[1].includes('{') && !match[1].includes('}')) {
    texts.add(match[1]);
  }
}

fs.writeFileSync('C:/Users/Hp/.gemini/antigravity/brain/9d5043fc-7760-46c7-a125-e15d3e386626/extracted_texts.json', JSON.stringify([...texts], null, 2));
console.log(`Saved ${texts.size} extracted texts.`);
