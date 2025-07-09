const express = require('express');
const multer = require('multer');

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary-konfiguration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wedding', // valfritt mappnamn i Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'heic', 'webp']
  },
});

const upload = multer({ storage });

// === Bilduppladdning ===
app.post('/gallery', upload.single('image'), async (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: 'Ingen fil mottagen' });
  }

  try {
    const imageUrl = req.file.path; // detta är Cloudinary URL
    const filename = req.file.filename || 'okänt filnamn';

    // Spara i Google Sheets
    await appendImageToSheet(imageUrl, filename);

    res.json({
      message: 'Bild uppladdad och sparad!',
      url: imageUrl
    });
  } catch (error) {
    console.error('Fel vid sparande till Google Sheets:', error);
    res.status(500).json({ message: 'Fel vid sparande i Google Sheets' });
  }
});


// === Google Sheets Setup ===
let credentials;
if (process.env.GOOGLE_CREDENTIALS) {
  credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
} else {
  credentials = JSON.parse(fs.readFileSync('credentials.json'));
}

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = '1Q4jz6KWrQ3mYS_XTq4wdTROKFM2vnQr63somTaR6VdA';// sheet id
const SHEET_NAME = 'Gästlista'; // <-- Fliknamnet i Google Sheets
const SHEET_NAME_GALLERY = 'WeddingGallery';
async function appendImageToSheet(url, filename) {
  const today = new Date().toLocaleDateString();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME_GALLERY}!A:C`,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [[url, filename, today]],
    },
  });
}

module.exports = { appendImageToSheet };
// === RSVP/OSA-endpoint ===
app.post('/rsvp/send', async (req, res) => {
  const { namn, rsvp, specialkost } = req.body;

  if (!namn || !rsvp) {
    return res.status(400).send({ message: 'Namn och OSA krävs' });
  }

  try {
    // Hämta alla rader i arket
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:C`, // Kolumnerna Namn, RSVP, Specialkost
    });

    const rows = response.data.values || [];
    const nameIndex = rows.findIndex(row => row[0] && row[0].toLowerCase() === namn.toLowerCase());

    if (nameIndex !== -1) {
      // Uppdatera befintlig rad
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A${nameIndex + 1}:C${nameIndex + 1}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[namn, rsvp, specialkost || '']],
        },
      });
    } else {
      // Lägg till ny rad
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:C`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[namn, rsvp, specialkost || '']],
        },
      });
    }

    res.send({ message: 'OSA sparad – tack!' });
  } catch (error) {
    console.error('Fel vid Google Sheets:', error);
    res.status(500).send({ message: 'Kunde inte spara i Google Sheets' });
  }
});

// === Routes ===
app.get('/page/:name', (req, res) => {
  const pageName = req.params.name;
  const filePath = path.join(__dirname, 'public', `${pageName}.html`);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(404).send('Sidan finns inte');
    } else {
      res.type('html').send(data);
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/rsvp', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/ourStory', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/bridalparty', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/gallery', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// === Starta server ===
app.listen(PORT, () => {
  console.log(`Servern körs på port ${PORT}`);
});
