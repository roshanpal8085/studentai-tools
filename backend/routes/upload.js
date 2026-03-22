const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit 
}).single('document');

router.post('/parse-pdf', (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `File upload error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ message: 'Unknown upload error occurred.' });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
      }

      const data = await pdfParse(req.file.buffer);
      
      if (!data.text || data.text.trim().length === 0) {
        return res.status(400).json({ message: 'Could not find any readable text in this PDF. Please ensure it is not a scanned image.' });
      }
      
      res.json({ 
        text: data.text,
        pages: data.numpages,
      });
    } catch (parseError) {
      console.error('PDF Parse Error:', parseError);
      res.status(500).json({ message: `PDF Parser Engine Error: ${parseError.message || parseError}` });
    }
  });
});

module.exports = router;
