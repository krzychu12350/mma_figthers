import express, { Request, Response } from 'express';
import puppeteer from 'puppeteer';  // Use puppeteer to interact with Browserless
//import { WebSocket } from 'ws'; // WebSocket to connect to the Browserless API

const app = express();
const port = 3000;

// Browserless WebSocket URL with your API token (replace YOUR_BROWSERLESS_API_KEY with your actual key)
const BROWSERLESS_API_URL = 'wss://chrome.browserless.io?token=RxHRCsmVD5aJKu66a5def27825af18f30ecbd4a217';

// Sample route to test the server
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Function to scrape the HTML page using Browserless (WebSocket)
async function scrapePageWithBrowserless(url: string): Promise<string> {
  const browser = await puppeteer.connect({
    browserWSEndpoint: BROWSERLESS_API_URL, // Connect using the Browserless WebSocket
  });

  const page = await browser.newPage(); // Open a new page

  // Navigate to the target URL
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // Get the HTML content of the page
  const html = await page.content();

  // Close the browser after scraping
  await browser.close();

  return html;
}

// Scraping route
app.get('/scrape', async (req: Request, res: Response) => {
  const url = 'https://www.kswmma.com/fighters'; // Example URL to scrape

  try {
    // Call the scrape function to get HTML content
    const pageHtml = await scrapePageWithBrowserless(url);

    // Send the HTML content as a response
    res.status(200).send(pageHtml);

  } catch (error) {
    console.error('Error scraping the page:', error);
    res.status(500).json({ error: 'Failed to fetch and scrape the page' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
