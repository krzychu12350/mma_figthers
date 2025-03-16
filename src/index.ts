import express, { Request, Response } from 'express';
// import axios from 'axios';
// import {chromium,  Page } from 'playwright'; // Import necessary types
// import  chromeLambda from 'chrome-aws-lambda'
// import puppeteer, { Browser } from 'puppeteer';
// import puppeteerCore, { Browser as BrowserCore } from 'puppeteer-core';
// import chromium from '@sparticuz/chromium-min';
// https://spacejelly.dev/posts/build-a-web-scraper-with-puppeteer-next-js-api-routes
// https://awstip.com/use-puppeteer-with-vercel-serverless-functions-in-a-next-js-application-5d6bbe627f84
const app = express();
const port = 3000;


// Sample route to test the server
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
