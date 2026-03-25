const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Load env vars
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
});
app.use(limiter);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/ai', require('./routes/ai'));
app.use('/api/pdf', require('./routes/pdf'));
app.use('/api/upload', require('./routes/upload'));

// Pre-allocate a large chunk to avoid per-request load
const SPEED_TEST_BUFFER = Buffer.alloc(1024 * 1024 * 50, 'x');

// Speed Test Endpoint
app.get('/api/speedtest', (req, res) => {
  const size = Math.min(parseInt(req.query.size) || 1024 * 1024 * 25, SPEED_TEST_BUFFER.length);
  res.writeHead(200, {
    'Content-Type': 'application/octet-stream',
    'Content-Length': size,
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  });
  res.end(SPEED_TEST_BUFFER.slice(0, size));
});

// Basic route
app.get('/', (req, res) => {
  res.send('StudentAI Tools API is running (Pure Stateless)...');
});

const PORT = process.env.PORT || 5000;

// Security Fallbacks
app.use((req, res, next) => {
  res.status(404).json({ message: 'API Endpoint not found.' });
});

app.use((err, req, res, next) => {
  console.error('\n[Fatal Error Caught]', err.stack || err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal Server Error',
    secure: true
  });
});

process.on('unhandledRejection', (err) => {
  console.error('[Unhandled Rejection]', err);
});

app.listen(PORT, () => {
  console.log(`Server running securely on port ${PORT}`);
});
