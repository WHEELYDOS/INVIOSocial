import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--use-gl=angle',
      '--use-angle=gl'
    ]
  });
  const page = await browser.newPage();
  
  // Set download behavior
  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: __dirname
  });

  console.log("Navigating to local site...");
  await page.goto('http://127.0.0.1:8443/', { waitUntil: 'networkidle2' });
  
  console.log("Waiting for Export Video button...");
  // Wait for the button
  await page.waitForFunction(() => {
    return Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Export Video'));
  }, { timeout: 15000 });
  
  const button = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Export Video'));
  });
  
  if (button) {
    console.log("Clicking Export Video...");
    await button.click();
    console.log("Waiting 10 seconds for recording and download to complete...");
    await new Promise(r => setTimeout(r, 10000));
  } else {
    console.log("Export Video button not found!");
  }
  
  await browser.close();
  console.log("Done");
})();
