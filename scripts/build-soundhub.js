import https from 'https';
import fs from 'fs';
import path from 'path';

const NOTION_API_KEY = "ntn_J1693294406VuGZNGLviRfQzCmiK6JI1vNeAgpOnJM41Nq";
const DATABASE_ID = "19eccfade8c34fe19e20672438507fb1";

async function buildSoundHub() {
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
      if (parsedData.results) {
        
        const mappedData = parsedData.results.map(row => {
          const props = row.properties;
          
          const extractText = (prop) => prop && prop.rich_text && prop.rich_text[0] ? prop.rich_text[0].plain_text : '';
          const extractTitle = (prop) => prop && prop.title && prop.title[0] ? prop.title[0].plain_text : '';
          const extractUrl = (prop) => prop && prop.url ? prop.url : '';
          const extractSelect = (prop) => prop && prop.select ? prop.select.name : '';

          let ytId = '';
          const rawUrl = extractUrl(props['3']);
          if (rawUrl.includes('v=')) {
            ytId = rawUrl.split('v=')[1].split('&')[0];
          } else if (rawUrl.includes('youtu.be/')) {
            ytId = rawUrl.split('youtu.be/')[1].split('?')[0];
          }

          return {
            id: ytId || row.id,
            category: extractSelect(props['1']),
            author: extractText(props['2']),
            url: rawUrl,
            youtubeId: ytId,
            title: extractTitle(props['4']),
            tags: extractText(props['5']),
            useCases: extractText(props['6']),
            duration: extractText(props['7']),
            thumb: ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : ''
          };
        });

        const outputPath = path.resolve(process.cwd(), 'src/data/notionArchive.json');
        fs.writeFileSync(outputPath, JSON.stringify(mappedData, null, 2));
        console.log(`Saved ${mappedData.length} records to ${outputPath}`);
      }
    });
  });

  req.on('error', e => console.error(e));
  req.write('{}');
  req.end();
}

buildSoundHub();
