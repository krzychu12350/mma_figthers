import axios from 'axios';
import express, { Request, Response } from 'express';
// import axios from 'axios';
// import {chromium,  Page } from 'playwright'; // Import necessary types
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';


// import  chromeLambda from 'chrome-aws-lambda'
// import puppeteer, { Browser } from 'puppeteer';
// import puppeteerCore, { Browser as BrowserCore } from 'puppeteer-core';
// import chromium from '@sparticuz/chromium-min';
// https://spacejelly.dev/posts/build-a-web-scraper-with-puppeteer-next-js-api-routes
// https://awstip.com/use-puppeteer-with-vercel-serverless-functions-in-a-next-js-application-5d6bbe627f84
const app = express();
const port = 3000;

// const remoteExecutablePath = "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar";

let browser: any;

// async function getBrowser() {
//   if (browser) return browser;

//   browser = await puppeteer.launch({
//     args: chromium.args,
//     defaultViewport: chromium.defaultViewport,
//     executablePath: await chromium.executablePath(),
//     headless: chromium.headless,
//   });

//   return browser;
// }

// async function checkPageStatus(url: string) {
//   let statusCode;
//   try {
//     // const page = await browser.newPage();
//     // const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
//     // statusCode = response && response.status() === 200 ? 200 : 404;
//     // await page.close();
//     statusCode = 200;
//   } catch (error) {
//     console.error('Error accessing page:', error);
//     statusCode = 404;
//   }
//   return statusCode === 200;
// }

app.get('/check', async (req, res) => {
  const url = "https://jp.mercari.com/en/item/m23504670122";
  if (!url) {
    res.status(400).json({ error: 'URL parameter is required' });
  }

  const status = 200;
  res.status(status ? 200 : 404).json({
    statusCode: status ? 200 : 404,
    is200: status,
  });
});

// Sample route to test the server
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
