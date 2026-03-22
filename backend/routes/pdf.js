const express = require('express');
const router = express.Router();
const multer = require('multer');
const { PDFDocument, rgb, degrees } = require('pdf-lib');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/merge', upload.array('pdfs', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ message: 'Please upload at least two PDF files to merge.' });
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of req.files) {
      const pdfBytes = file.buffer;
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=merged.pdf');
    res.send(Buffer.from(mergedPdfBytes));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error merging PDFs' });
  }
});

router.post('/compress', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const pdfBytes = req.file.buffer;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=compressed.pdf');
    res.send(pdfBytes);
  } catch (error) {
    res.status(500).json({ message: 'Error compressing PDF' });
  }
});

router.post('/split', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const { startPage, endPage } = req.body;
    
    const start = parseInt(startPage);
    const end = parseInt(endPage);
    
    if (isNaN(start) || isNaN(end) || start < 1 || end < start) {
      return res.status(400).json({ message: 'Invalid page range' });
    }

    const pdfBytes = req.file.buffer;
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pageCount = pdfDoc.getPageCount();

    if (end > pageCount) {
      return res.status(400).json({ message: `Document only has ${pageCount} pages.` });
    }

    const newPdf = await PDFDocument.create();
    
    const pageIndices = [];
    for (let i = start - 1; i <= end - 1; i++) {
      pageIndices.push(i);
    }

    const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const newPdfBytes = await newPdf.save();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=split.pdf');
    res.send(Buffer.from(newPdfBytes));
  } catch (error) {
    res.status(500).json({ message: 'Error splitting PDF' });
  }
});

router.post('/watermark', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Watermark text is required' });
    }

    const pdfBytes = req.file.buffer;
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    const pages = pdfDoc.getPages();
    for (const page of pages) {
      const { width, height } = page.getSize();
      page.drawText(text, {
        x: width / 2 - (text.length * 15),
        y: height / 2,
        size: 50,
        color: rgb(0.8, 0.8, 0.8),
        rotate: degrees(45),
        opacity: 0.5,
      });
    }

    const newPdfBytes = await pdfDoc.save();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=watermarked.pdf');
    res.send(Buffer.from(newPdfBytes));
  } catch (error) {
    res.status(500).json({ message: 'Error adding watermark to PDF' });
  }
});

router.post('/delete-pages', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const { pages } = req.body; 
    
    if (!pages) {
      return res.status(400).json({ message: 'Pages to delete are required' });
    }

    const pdfBytes = req.file.buffer;
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const totalPages = pdfDoc.getPageCount();

    const indicesToDelete = pages.split(',')
      .map(p => parseInt(p.trim()) - 1)
      .filter(p => !isNaN(p) && p >= 0 && p < totalPages)
      .sort((a, b) => b - a);

    const uniqueIndices = [...new Set(indicesToDelete)];

    if (uniqueIndices.length === 0 || uniqueIndices.length >= totalPages) {
      return res.status(400).json({ message: 'Invalid pages selected for deletion. You cannot delete all pages.' });
    }

    for (const index of uniqueIndices) {
      pdfDoc.removePage(index);
    }

    const newPdfBytes = await pdfDoc.save();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=deleted_pages.pdf');
    res.send(Buffer.from(newPdfBytes));
  } catch (error) {
    res.status(500).json({ message: 'Error deleting pages from PDF' });
  }
});

module.exports = router;
