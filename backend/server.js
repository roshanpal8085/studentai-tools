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

// --- Speed Test Endpoints ---
const crypto = require('crypto');

app.get('/api/ping', (req, res) => {
  res.status(200).json({ timestamp: Date.now() });
});

app.get('/api/download-test', (req, res) => {
    const sizeInMb = parseInt(req.query.size) || 10; // Default 10MB
    const chunkSize = 1024 * 1024; // 1MB chunk
    let bytesSent = 0;

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=speedtest.bin');
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');

    const sendChunk = () => {
        if (bytesSent < sizeInMb * 1024 * 1024) {
            const buffer = crypto.randomBytes(chunkSize);
            res.write(buffer);
            bytesSent += chunkSize;
            setImmediate(sendChunk); 
        } else {
            res.end();
        }
    };

    sendChunk();
});

app.post('/api/upload-test', (req, res) => {
    let startTime = Date.now();
    let byteCount = 0;

    req.on('data', (chunk) => {
        byteCount += chunk.length;
    });

    req.on('end', () => {
        let endTime = Date.now();
        let durationInSeconds = (endTime - startTime) / 1000;
        if (durationInSeconds === 0) durationInSeconds = 0.001; // Avoid division by zero
        let speedBps = (byteCount * 8) / durationInSeconds; // Bits per second
        let speedMbps = (speedBps / (1024 * 1024)).toFixed(2);

        res.json({
            received: byteCount,
            duration: durationInSeconds,
            speedMbps: speedMbps,
            success: true
        });
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
