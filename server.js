const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = false;
const hostname = 'localhost';
// cPanel dynamic PORT or fallback to random unallocated port to prevent shared host collision
const port = parseInt(process.env.PORT || '38472', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  })
    .once('error', (err) => {
      console.error('Server binding error:', err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Vera Eşarp Production Server ready on port/socket ${port}`);
    });
});
