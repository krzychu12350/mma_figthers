import express, {Request, Response} from 'express';
import axios from 'axios';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/fetch-fighters', async (req: Request, res: Response): Promise<any> => {
  const options = {
    method: 'POST',
    url: 'https://production-sfo.browserless.io/chrome/bql',
    params: {
      token: 'RxHRCsmVD5aJKu66a5def27825af18f30ecbd4a217',
    },
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      query: `mutation FetchFighters {
        goto(url: "https://www.kswmma.com/fighters") {
          status
        }

        clickPage1: click(selector: ".text-center > span:nth-child(3)", visible: true, wait: true, scroll: true) {
          x
          y
        }
        page1Content: html(selector: "div#players-page-content", visible: true) {
          html
        }

        clickPage2: click(selector: ".text-center > span:nth-child(4)", visible: true, wait: true, scroll: true) {
          x
          y
        }
        page2Content: html(selector: "div#players-page-content", visible: true) {
          html
        }

        clickPage3: click(selector: ".text-center > span:nth-child(5)", visible: true, wait: true, scroll: true) {
          x
          y
        }
        page3Content: html(selector: "div#players-page-content", visible: true) {
          html
        }

        clickPage4: click(selector: ".text-center > span:nth-child(6)", visible: true, wait: true, scroll: true) {
          x
          y
        }
        page4Content: html(selector: "div#players-page-content", visible: true) {
          html
        }

        clickPage5: click(selector: ".text-center > span:nth-child(7)", visible: true, wait: true, scroll: true) {
          x
          y
        }
        page5Content: html(selector: "div#players-page-content", visible: true) {
          html
        }

        clickPage6: click(selector: ".text-center > span:nth-child(8)", visible: true, wait: true, scroll: true) {
          x
          y
        }
        page6Content: html(selector: "div#players-page-content", visible: true) {
          html
        }

        clickPage7: click(selector: ".text-center > span:nth-child(9)", visible: true, wait: true, scroll: true) {
          x
          y
        }
        page7Content: html(selector: "div#players-page-content", visible: true) {
          html
        }

        clickPage8: click(selector: ".text-center > span:nth-child(10)", visible: true, wait: true, scroll: true) {
          x
          y
        }
        page8Content: html(selector: "div#players-page-content", visible: true) {
          html
        }

        clickPage9: click(selector: ".text-center > span:nth-child(11)", visible: true, wait: true, scroll: true) {
          x
          y
        }
        page9Content: html(selector: "div#players-page-content", visible: true) {
          html
        }

        clickPage10: click(selector: ".text-center > span:nth-child(12)", visible: true, wait: true, scroll: true) {
          x
          y
        }
        page10Content: html(selector: "div#players-page-content", visible: true) {
          html
        }
      }`,
      variables: null,
      operationName: 'FetchFighters',
    },
  };

  try {
    const { data } = await axios.request(options);
    return res.json(data); // Return the fetched data as a JSON response
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
