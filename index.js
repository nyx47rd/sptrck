const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

const WIDGET_URL = 'https://widgetapp.stream/view/831dc32d-7a0a-4c6b-8997-029fef192634_18cb53a3-55f0-4eb8-86e3-1aeb88d6ebca';

app.get('/proxy-widget', async (req, res) => {
  try {
    const response = await axios.get(WIDGET_URL, {
      headers: {
        // It's good practice to set a user-agent
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
      }
    });

    let html = response.data;

    // Inject a <base> tag to ensure relative paths for assets (CSS, JS, images) work correctly.
    const baseHref = new URL(WIDGET_URL).origin;
    const baseTag = `<base href="${baseHref}/">`;

    if (html.includes('<head>')) {
      html = html.replace('<head>', `<head>${baseTag}`);
    } else {
      // Fallback if no <head> tag is present
      html = baseTag + html;
    }

    res.send(html);
  } catch (error) {
    console.error('Error proxying widget:', error.response ? error.response.status : error.message);
    res.status(500).send('Error loading widget.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});