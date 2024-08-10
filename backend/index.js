const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 5000;

// Middleware to handle CORS (allow frontend to communicate with backend)
app.use(cors());

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Route to handle PDF file upload
app.post('/upload', upload.single('pdf'), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  // Read and parse the PDF
  const dataBuffer = fs.readFileSync(file.path);
  pdfParse(dataBuffer).then((data) => {
    // Send the extracted text back to the client
    res.json({ text: data.text });
  }).catch((error) => {
    res.status(500).send('Error processing PDF.');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
