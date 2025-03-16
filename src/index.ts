import express, { Request, Response } from 'express';
// import puppeteer from 'puppeteer'; // Use puppeteer for Browserless
// import { Page } from 'puppeteer'; // Import necessary types

const app = express();
const port = 3000;

// Browserless WebSocket URL with your API token (replace YOUR_BROWSERLESS_API_KEY with your actual key)
const BROWSERLESS_API_URL = 'wss://chrome.browserless.io?token=RxHRCsmVD5aJKu66a5def27825af18f30ecbd4a217';

// Sample route to test the server
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
