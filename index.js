const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const WIDGET_URL = 'https://widgetapp.stream/view/831dc32d-7a0a-4c6b-8997-029fef192634_18cb53a3-55f0-4eb8-86e3-1aeb88d6ebca';

app.get('/proxy-widget', (req, res) => {
  try {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Widget Proxy</title>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
          }
          iframe {
            width: 100%;
            height: 100%;
            border: none;
          }
        </style>
      </head>
      <body>
        <iframe src="${WIDGET_URL}"></iframe>
      </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    console.error('Error proxying widget:', error.message);
    res.status(500).send('Error loading widget.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});