const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const path = require('path');
// Load env vars from the current directory
dotenv.config({ path: path.join(__dirname, '.env') });

console.log(`[Backend] Environment loaded. Port: ${process.env.PORT || 5000}`);
if (!process.env.GEMINI_API_KEY) {
    console.error("[Backend] CRITICAL: GEMINI_API_KEY is missing from .env!");
}

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

// --- Industry-Standard Fixed-File Endpoints (v5 Pro) ---
const crypto = require('crypto');
const MASTER_POOL = crypto.randomBytes(1024 * 1024 * 50); // 50MB master random pool

app.get('/api/ping', (req, res) => {
  res.status(200).json({ timestamp: Date.now() });
});

// Serve fixed-size binary files for precise Mbps calculation
app.get('/api/speed-test/:size', (req, res) => {
    const sizeStr = req.params.size;
    let size = 10 * 1024 * 1024; // Default 10MB
    
    if (sizeStr.includes('1mb')) size = 1 * 1024 * 1024;
    else if (sizeStr.includes('5mb')) size = 5 * 1024 * 1024;
    else if (sizeStr.includes('10mb')) size = 10 * 1024 * 1024;
    else if (sizeStr.includes('50mb')) size = 50 * 1024 * 1024;

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length', size);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.setHeader('Content-Disposition', `attachment; filename=${sizeStr}`);
    
    // Serve exactly the requested bytes from the master pool
    res.end(MASTER_POOL.slice(0, size));
});

// Legacy support for download-test (maps to 25MB)
app.get('/api/download-test', (req, res) => {
    res.redirect('/api/speed-test/25mb.bin');
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
