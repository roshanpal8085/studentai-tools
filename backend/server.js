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

// --- Speed Test v7 Endpoints ---
const TEST_BUFFER = Buffer.alloc(1024 * 1024 * 25, 'x'); // 25MB test file

app.get('/api/ping', (req, res) => {
  res.status(200).json({ timestamp: Date.now() });
});

app.get('/api/download-test', (req, res) => {
  const size = Math.min(parseInt(req.query.size) || 1024 * 1024 * 10, TEST_BUFFER.length);
  res.set({
    'Content-Type': 'application/octet-stream',
    'Content-Length': size,
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
  });
  res.send(TEST_BUFFER.slice(0, size));
});

app.post('/api/upload-test', (req, res) => {
  let bytesReceived = 0;
  req.on('data', (chunk) => { bytesReceived += chunk.length; });
  req.on('end', () => {
    res.status(200).json({ received: bytesReceived, success: true });
  });
});
// ------------------------------

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
