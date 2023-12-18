import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import got from 'got';
import fs from 'fs';
import _ from 'lodash';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

interface HarEntry {
  request: {
    method: string;
    url: string;
    headers: Array<{ name: string; value: string }>;
    postData: { text: string };
  };
}

interface HarData {
  log: {
    entries: HarEntry[];
  };
}

const harData: HarData = JSON.parse(fs.readFileSync('www.facebook.com.har', 'utf8'));

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/replicate-request/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const response = await replicateFacebookRequest(userId);
    res.json(response);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

async function replicateFacebookRequest(userId: string): Promise<any> {
  const entry = _.get(harData, 'log.entries[38]', null) as HarEntry | null;
  if (!entry) {
    throw new Error('No entry found in HAR file for the given index');
  }

  const { method, url, headers, postData } = entry.request;

  // Filter out pseudo-headers and other non-HTTP/1.1 headers
  const dynamicHeaders = headers.reduce((acc: Record<string, string>, header) => {
    if (!header.name.startsWith(':')) {
      acc[header.name] = header.value;
    }
    return acc;
  }, {});

  let dynamicBody = postData.text;
  dynamicBody = dynamicBody.replace(/__user=[^&]+/, `__user=${userId}`);

  try {
    const response = await got(url, {
      method: method as 'POST',
      headers: dynamicHeaders,
      body: dynamicBody,
    });
    return JSON.parse(response.body);
  } catch (error: any) {
    throw new Error('Request failed: ' + error.message);
  }
}

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
