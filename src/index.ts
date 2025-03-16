import express, { Request, Response } from 'express';
import { chromium, Page } from 'playwright'; // Import necessary types
// import  chromeLambda from 'chrome-aws-lambda'
import puppeteer from 'puppeteer'

const app = express();
const port = 3000;

// let puppeteer: any;
// let chromeLambda: any;

// if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  // import("chrome-aws-lambda").then((chrome) => {
  //   chromeLambda = chrome;
  // });
//   import("puppeteer-core").then((pup) => {
//     puppeteer = pup;
//   });
// } else {
//   import("puppeteer").then((pup) => {
//     puppeteer = pup;
//   });
// }


// app.get("/test", async (req: Request, res: Response): Promise<void> => {
//   let options: any = {
//     headless: true,
//     ignoreHTTPSErrors: true,
//   };

//   // if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
//   //   options = {
//   //     args: [...(chromeLambda?.args || []), "--hide-scrollbars", "--disable-web-security"],
//   //     defaultViewport: chromeLambda?.defaultViewport || null,
//   //     executablePath: (await chromeLambda?.executablePath) || null,
//   //     headless: true,
//   //     ignoreHTTPSErrors: true,
//   //   };
//   // }

//   try {
//     let browser = await puppeteer.launch(options);
  
//     let page = await browser.newPage();
//     await page.goto("https://www.kswmma.com/fighters");
  
//     // Use page.content() to get the HTML content of the page
//     const pageContent = await page.content();
  
//     // Send the HTML content in the response
//     res.send(pageContent);
  
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('An error occurred while fetching the page.');
//   }
  
// });

// Sample route to test the server
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Function to click on a pagination page number
async function clickPaginationPage(page: Page, pageNumber: number): Promise<void> {
  try {
    console.log(`Clicking on page ${pageNumber}`);
    // Wait for the pagination to be available
    await page.waitForSelector('.custom-pagination', { timeout: 5000 });

    // Click on the page number dynamically based on the provided page number
    await page.click(`.custom-pagination span:has-text("${pageNumber}")`);

    // Wait for the page to load after the click
    await page.waitForTimeout(2000); // Adjust the timeout if needed to ensure the page is loaded fully
    console.log(`Successfully clicked on page ${pageNumber}`);
  } catch (error) {
    console.error('Error clicking on pagination page:', error);
    throw error;
  }
}

// Function to scrape fighter data from the current page
async function scrapeFighters(page: Page): Promise<any[]> {
  try {
    console.log('Scraping fighters...');
    // Extract the relevant content using a selector
    const fightersData = await page.evaluate(() => {
      const fighters: any[] = [];
      const rows = document.querySelectorAll('div.fighter-card.py-3'); // Adjust this selector as needed

      console.log('Rows found:', rows.length);  // Log the number of rows

      rows.forEach(row => {
        // Use type assertion to specify that the elements are HTMLElement
        const name = row.querySelector('.fighter-name')
          ? (row.querySelector('.fighter-name') as HTMLElement).innerText.replace(/\n/g, ' ').trim() // Clean up name
          : 'Unknown';

        const weight = row.querySelector('.fighter-data')
          ? (row.querySelector('.fighter-data') as HTMLElement).innerText
          : 'No Data';

        // Get the fighter profile link and extract the ID
        const profileLink = row.querySelector('a.fighter-btn');
        const fighterId = profileLink ? (profileLink as HTMLAnchorElement).href.split('/').pop() : 'No ID';

        // Generate the full fighter details URL
        const fighterDetailsUrl = `https://www.kswmma.com/zawodnikk/${fighterId}`;

        // Get the fighter image
        const imageElement = row.querySelector('img');
        const imageUrl = imageElement ? (imageElement as HTMLImageElement).src : 'No Image';

        // Push the data into the array
        fighters.push({ name, weight, fighterId, fighterDetailsUrl, imageUrl });
      });

      return fighters;
    });

    console.log('Scraped Fighters:', fightersData);  // Log the scraped data to the console

    return fightersData;
  } catch (error) {
    console.error('Error scraping the page:', error);
    throw error;
  }
}


// Scraping route
app.get('/api/fighters', async (req: Request, res: Response) => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    const url = 'https://www.kswmma.com/fighters'; // URL to scrape
    console.log(`Navigating to URL: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded' });  // Make sure page is fully loaded

    // Set up an array to hold all scraped fighter data
    let allFighters: any[] = [];

    // Loop through pagination and scrape fighters from each page (you can adjust the range or logic for pagination)
    const totalPages = 8;  // Set this to the total number of pages you want to scrape
    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
      console.log(`Navigating to page ${pageNumber}`);

      // Click on the pagination page
      await clickPaginationPage(page, pageNumber);

      // Scrape the fighters on the current page
      const fightersData = await scrapeFighters(page);

      // Add the scraped fighters to the overall array
      allFighters = [...allFighters, ...fightersData];
    }

    // Close the browser after scraping
    await browser.close();

    // Return the scraped data in JSON format
    res.status(200).json({ fighters: allFighters });

  } catch (error: any) {
    // Log error details
    console.error('Error scraping the page:', error);

    // Check if the error has additional details, like a message or stack trace
    if (error instanceof Error) {
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
    }

    // Respond with a failure message and include the error details (optional)
    res.status(500).json({
      error: 'Failed to fetch and scrape the page',
      message: error.message, // Include the error message in the response
      stack: error.stack,     // Optionally, include the stack trace (be cautious with this in production)
    });
  }
});
async function scrapeFighterDetails(page: any) {
  try {
    // Extract the necessary details using selectors
    const fighterDetails = await page.evaluate(() => {
      const details: any = {};

      // Extract the country flag and country name
      const countryFlag = document.querySelector('img[alt="flag"]') as HTMLImageElement;
      details.country = countryFlag ? countryFlag.src : 'Unknown';

      // Extract the fighter's name
      const firstName = document.querySelector('.player-firstname') as HTMLElement;
      const lastName = document.querySelector('.player-surname') as HTMLElement;
      details.name = firstName && lastName ? `${firstName.innerText} ${lastName.innerText}` : 'Unknown Fighter';

      // Extract the weight category
      const weightCategory = document.querySelector('.weight-category') as HTMLElement;
      details.weightCategory = weightCategory ? weightCategory.innerText.trim() : 'Unknown Category';

      // Extract the fighter's photo (large version)
      const fighterPhotoLg = document.querySelector('.fighter-photo-lg') as HTMLImageElement;
      details.photoLgUrl = fighterPhotoLg ? fighterPhotoLg.src : 'No Large Photo';

      // Extract the fighter's photo (small version)
      const fighterPhoto = document.querySelector('.fighter-photo') as HTMLImageElement;
      details.photoUrl = fighterPhoto ? fighterPhoto.src : 'No Photo';

      // Extract age, height, and weight
      const fighterData = document.querySelectorAll('.fighter-data-block .fighter-data') as NodeListOf<HTMLElement>;
      if (fighterData.length >= 3) {
        details.age = fighterData[0] ? fighterData[0].innerText.trim() : 'N/A';
        details.height = fighterData[1] ? fighterData[1].innerText.trim() : 'N/A';
        details.weight = fighterData[2] ? fighterData[2].innerText.trim() : 'N/A';
      } else {
        details.age = 'N/A';
        details.height = 'N/A';
        details.weight = 'N/A';
      }

      // Extract fight record (wins-losses-draws)
      const record = document.querySelector('.fighter-record') as HTMLElement;
      details.record = record ? record.innerText.trim() : 'No Record Available';

      // Extract Instagram link (if available)
      const instagramLink = document.querySelector('a[href^="https://www.instagram.com"]') as HTMLAnchorElement;
      details.instagramLink = instagramLink ? instagramLink.href : 'No Instagram';

      return details;
    });

    return fighterDetails;
  } catch (error) {
    console.error('Error scraping fighter details:', error);
    throw new Error('Failed to scrape fighter details');
  }
}


// New route for fetching fighter details by ID
app.get('/api/fighters/:id', async (req: Request, res: Response) => {
  try {
    const fighterId = req.params.id;  // Extract fighter ID from the URL
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    const fighterUrl = `https://www.kswmma.com/zawodnikk/${fighterId}`;  // URL to the specific fighter's page
    await page.goto(fighterUrl, { waitUntil: 'domcontentloaded' });

    // Scrape the detailed fighter data from the page
    const fighterDetails = await scrapeFighterDetails(page);

    // Close the browser after scraping
    await browser.close();

    // Return the detailed fighter data in JSON format
    res.status(200).json(fighterDetails);

  } catch (error) {
    console.error('Error scraping fighter details:', error);
    res.status(500).json({ error: 'Failed to fetch fighter details' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
