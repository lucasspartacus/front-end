/*
Lucas Spartacus Vieira Carvalho 
Shaw and Partners
Implementation of the back-end server using nod
*/

const express = require('express');
const multer = require('multer');
const Papa = require('papaparse');
const path = require('path');
const app = express();
const port = 3000;

// Set up storage with Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// In-memory data structure to store CSV data
let csvData = [];

// POST /api/files endpoint to handle CSV uploads
app.post('/api/files', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const file = req.file.buffer.toString();
  Papa.parse(file, {
    header: true,
    complete: (results) => {
      csvData = results.data;
      console.log(`status 200`);
      res.status(200).json({ message: 'The file was uploaded successfully.' });
    },
    error: (error) => {
      console.log(`status 500`);
      res.status(500).json({ message: `Error parsing file: ${error.message}` });
    }
  });
});

// GET /api/data endpoint to return the CSV data
app.get('/api/data', (req, res) => {
    res.status(200).json(csvData);
});
  
  // GET /api/users endpoint to search through the CSV data
app.get('/api/users', (req, res) => {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: 'No search query provided' });
    }
  
    try {
      const searchQuery = query.toLowerCase();
      const filteredData = csvData.filter(row =>
        Object.values(row).some(value =>
          value.toLowerCase().includes(searchQuery)
        )
      );
      console.log(`status 200`);
      res.status(200).json({ data: filteredData });
    } catch (error) {
      console.log(`status 500`);
      res.status(500).json({ message: `Error searching data: ${error.message}` });
    }
});
// Serve the React app
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
