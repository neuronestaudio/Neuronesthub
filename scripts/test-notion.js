import https from 'https';

const NOTION_API_KEY = "ntn_J1693294406VuGZNGLviRfQzCmiK6JI1vNeAgpOnJM41Nq";
const DATABASE_ID = "19eccfade8c34fe19e20672438507fb1";

async function fetchNotion() {
  const options = {
    hostname: 'api.notion.com',
    path: `/v1/databases/${DATABASE_ID}/query`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    }
  };

  const req = https.request(options, res => {
    let rawData = '';
    res.on('data', chunk => rawData += chunk);
    res.on('end', () => {
      const parsedData = JSON.parse(rawData);
      if (parsedData.results && parsedData.results.length > 0) {
        console.log(JSON.stringify(parsedData.results[0].properties, null, 2));
      } else {
        console.log("No results found or error:", parsedData);
      }
    });
  });

  req.on('error', e => console.error(e));
  req.write('{}');
  req.end();
}

fetchNotion();
