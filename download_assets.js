import https from 'https';
import fs from 'fs';
import path from 'path';

const filesToDownload = [
  { url: 'https://detaypeyzaj.com.tr/logo.svg', dest: 'public/logo.svg' },
  { url: 'https://detaypeyzaj.com.tr/images/slider/S1.jpeg', dest: 'public/images/slider/S1.jpeg' },
  { url: 'https://detaypeyzaj.com.tr/images/slider/S2.jpeg', dest: 'public/images/slider/S2.jpeg' },
  { url: 'https://detaypeyzaj.com.tr/images/slider/S3.jpeg', dest: 'public/images/slider/S3.jpeg' },
  { url: 'https://detaypeyzaj.com.tr/images/anasayfa/kolaj.png', dest: 'public/images/anasayfa/kolaj.png' },
  { url: 'https://detaypeyzaj.com.tr/images/postImg/proje2.jpeg', dest: 'public/images/postImg/proje2.jpeg' },
  { url: 'https://detaypeyzaj.com.tr/images/postImg/iletisim.jpeg', dest: 'public/images/postImg/iletisim.jpeg' },
  { url: 'https://detaypeyzaj.com.tr/images/acardion/2.jpg', dest: 'public/images/acardion/2.jpg' },
];

function downloadFile(fileUrl, destPath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(destPath);
    https.get(fileUrl, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${destPath}`);
          resolve(true);
        });
      } else {
        console.log(`Failed ${response.statusCode} for ${fileUrl}`);
        file.close();
        fs.unlinkSync(destPath);
        resolve(false);
      }
    }).on('error', (err) => {
      console.error(`Error downloading ${fileUrl}:`, err.message);
      resolve(false);
    });
  });
}

async function main() {
  console.log('Downloading assets from detaypeyzaj.com.tr...');
  for (const item of filesToDownload) {
    await downloadFile(item.url, item.dest);
  }
  console.log('Finished downloading assets.');
}

main();
