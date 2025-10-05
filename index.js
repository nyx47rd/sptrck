const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 3000;

const WIDGET_PATH = '/view/831dc32d-7a0a-4c6b-8997-029fef192634_18cb53a3-55f0-4eb8-86e3-1aeb88d6ebca';
const TARGET_URL = 'https://widgetapp.stream';

// This endpoint serves the initial HTML page with an iframe.
// The iframe's src points to our own proxied path.
app.get('/proxy-widget', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Widget Proxy</title>
      <style>
        body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
        iframe { width: 100%; height: 100%; border: none; }
      </style>
    </head>
    <body>
      <iframe src="/widget${WIDGET_PATH}"></iframe>
    </body>
    </html>
  `;
  res.send(html);
});

// This middleware proxies all requests from /widget/* to the target URL.
// This includes the initial HTML load for the iframe, plus all subsequent
// API calls, WebSockets, etc., made by the widget's JavaScript.
app.use('/widget', createProxyMiddleware({
  target: TARGET_URL,
  changeOrigin: true, // Necessary for virtual-hosted sites
  pathRewrite: {
    '^/widget': '', // Remove the '/widget' prefix
  },
  onProxyReq: (proxyReq, req, res) => {
    // It's good practice to set a user-agent
    proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy Error');
  }
}));

app.listen(port, () => {
  console.log(`Server is running. Access the widget at http://localhost:${port}/proxy-widget`);
});