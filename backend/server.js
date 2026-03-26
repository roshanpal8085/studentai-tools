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

// --- Industry-Standard Multi-Stream Endpoints (LibreSpeed Optimized) ---
const crypto = require('crypto');
const STATIC_POOL = crypto.randomBytes(1024 * 1024 * 10); // 10MB static random pool for zero-overhead serving

app.get('/api/ping', (req, res) => {
  res.status(200).json({ timestamp: Date.now() });
});

app.get('/api/download-test', (req, res) => {
    // Disable compression and cache
    res.setHeader('Content-Encoding', 'identity'); // Force no-compression
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.setHeader('Content-Disposition', 'attachment; filename=speedtest.bin');

    // Repeatedly write the static pool to the response (Zero CPU entropy cost)
    const writeLoop = () => {
        if (res.writableEnded) return;
        const canWrite = res.write(STATIC_POOL);
        if (canWrite) {
            setImmediate(writeLoop);
        } else {
            res.once('drain', writeLoop);
        }
    };
    writeLoop();
    
    // Safety timeout: Auto-terminate stream after 20 seconds to prevent hanging connections
    setTimeout(() => { if (!res.writableEnded) res.end(); }, 20000);
});

app.post('/api/upload-test', (req, res) => {
    let startTime = Date.now();
    let byteCount = 0;

    req.on('data', (chunk) => {
        byteCount += chunk.length;
    });

    req.on('end', () => {
        let duration = (Date.now() - startTime) / 1000;
        if (duration < 0.001) duration = 0.001;
        const mbps = ((byteCount * 8) / (duration * 1024 * 1024)).toFixed(2);
        res.json({ received: byteCount, speedMbps: mbps, success: true });
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
