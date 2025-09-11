require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {google} = require('googleapis');
const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// Cloudinary setup
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wedding',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        public_id: (req, file) => `${Date.now()}-${file.originalname}`
    }
});
const upload = multer({storage});

// Google Sheets setup
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});
const sheets = google.sheets({version: 'v4', auth});
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME_GALLERY = 'WeddingGallery';
const SHEET_NAME_RSVP = 'Gästlista';

// === Routes ===
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/gallery', (req, res) => res.sendFile(path.join(__dirname, 'public', 'gallery.html')));
app.get('/rsvp', (req, res) => res.sendFile(path.join(__dirname, 'public', 'rsvp.html')));

// === API: Galleri ===
// Ladda upp en bild
// Upload endpoint
app.post('/api/gallery/upload', upload.single('image'), (req, res) => {
    console.log(req.file); // Debug
    if (!req.file || !req.file.path) {
        return res.status(400).json({message: 'Ingen fil mottagen'});
    }
    res.json({
        message: 'Bild uppladdad!',
        url: req.file.path
    });
});

// Hämta bilder
app.get('/api/gallery', async (req, res) => {
    try {
        const {resources} = await cloudinary.search
            .expression('folder:wedding')
            .sort_by('created_at', 'desc')
            .max_results(30)
            .execute();
        const urls = resources.map(file => file.secure_url);
        res.json(urls);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Kunde inte hämta bilder'});
    }
});


// === API: RSVP ===
app.post('/api/rsvp', async (req, res) => {
    const {namn, rsvp, specialkost} = req.body;
    if (!namn || !rsvp) return res.status(400).json({message: 'Namn och OSA krävs'});

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME_RSVP}!A:C`
        });
        const rows = response.data.values || [];
        const nameIndex = rows.findIndex(row => row[0]?.toLowerCase() === namn.toLowerCase());

        if (nameIndex !== -1) {
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `${SHEET_NAME_RSVP}!A${nameIndex + 1}:C${nameIndex + 1}`,
                valueInputOption: 'USER_ENTERED',
                requestBody: {values: [[namn, rsvp, specialkost || '']]}
            });
        } else {
            await sheets.spreadsheets.values.append({
                spreadsheetId: SPREADSHEET_ID,
                range: `${SHEET_NAME_RSVP}!A:C`,
                valueInputOption: 'USER_ENTERED',
                requestBody: {values: [[namn, rsvp, specialkost || '']]}
            });
        }
        res.json({message: 'OSA sparad – tack!'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Kunde inte spara i Google Sheets'});
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servern körs på port ${PORT}`));
