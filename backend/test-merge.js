const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const FormData = require('form-data');
const axios = require('axios');

async function run() {
  try {
    const pdf1 = await PDFDocument.create();
    pdf1.addPage();
    fs.writeFileSync('test1.pdf', await pdf1.save());
    
    const pdf2 = require('pdf-lib').PDFDocument;
    const p2 = await pdf2.create();
    p2.addPage();
    fs.writeFileSync('test2.pdf', await p2.save());

    const form = new FormData();
    form.append('pdfs', fs.createReadStream('test1.pdf'));
    form.append('pdfs', fs.createReadStream('test2.pdf'));

    const res = await axios.post('http://127.0.0.1:5000/api/pdf/merge', form, {
      headers: form.getHeaders(),
    });
    console.log("Success! Status:", res.status);
  } catch (err) {
    if (err.response) {
      console.error("Server Error:", err.response.status, err.response.data);
    } else {
      console.error("Error connecting:", err.message);
    }
  }
}
run();
