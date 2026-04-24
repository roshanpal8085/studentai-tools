import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const logs = [];
  page.on('console', msg => {
      logs.push('BROWSER_CONSOLE: ' + msg.text());
  });
  
  page.on('pageerror', err => {
      logs.push('BROWSER_ERROR: ' + err.message);
  });
  
  await page.goto('http://localhost:5173/blog', { waitUntil: 'networkidle0' });
  
  fs.writeFileSync('./puppeteer-logs.txt', logs.join('\n'));
  
  await browser.close();
})();
