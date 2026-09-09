import fs from 'fs';

const jsPath = 'C:/Users/Hp/.gemini/antigravity/brain/9d5043fc-7760-46c7-a125-e15d3e386626/.system_generated/steps/350/content.md';
const code = fs.readFileSync(jsPath, 'utf8');

// Look for image/logo/svg references
const svgMatches = code.match(/<svg[\s\S]*?<\/svg>/gi) || [];
console.log('SVG count:', svgMatches.length);

// Look for logo
const logoIndex = code.indexOf('logo');
console.log('logo occurrences:', (code.match(/logo/gi) || []).length);

// Look for services/projects/sections
const sections = [];
const keywordMatches = code.match(/[\w$]+\s*=\s*\[\{[\s\S]*?\}\]/g) || [];
console.log('Array of objects matches:', keywordMatches.length);

// Extract snippets around key Turkish words
const keywords = ['Peyzaj', 'Hizmet', 'Hakkımızda', 'Proje', 'İletişim', 'Bahçe', 'Sulama', 'Çim', 'Bitki', 'Telefon', 'Adres', 'detay'];
const results = {};

for (const kw of keywords) {
  let pos = 0;
  const list = [];
  while ((pos = code.indexOf(kw, pos)) !== -1) {
    const start = Math.max(0, pos - 100);
    const end = Math.min(code.length, pos + 250);
    list.push(code.slice(start, end));
    pos += kw.length;
    if (list.length >= 5) break;
  }
  results[kw] = list;
}

fs.writeFileSync('C:/Users/Hp/.gemini/antigravity/brain/9d5043fc-7760-46c7-a125-e15d3e386626/snippets.json', JSON.stringify(results, null, 2));
console.log('Saved snippets.json');
