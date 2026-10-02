# 👰🏽‍♀️🤵🏼‍♂️Anna & Joel - Wedding Website

A personal wedding website created for our wedding on **1 August 2026**.

## ✨ About

This website was created to provide our wedding guests with all the information they needed before and during the wedding.

The website includes information about the ceremony, reception, schedule, dress code, locations and other practical details.

## 🛠️ Technologies

- HTML
- CSS
- JavaScript
- Node.js
- Express
- Cloudinary
- Google Sheets

## 📋 Features

- Wedding information
- Wedding schedule
- Ceremony and reception details
- Dress code
- Location information
- Guest information
- Responsive design
- Mobile-friendly layout
- RSVP

## 🎨 Design

The website was designed with a romantic and minimalist aesthetic, using soft neutral colours and eucalyptus green as the main accent colour.

The focus was on creating a simple, elegant and user-friendly experience for the wedding guests.

## 📸 Photo Sharing

Guests can share photos from the wedding through the website.

Images are uploaded and stored using **Cloudinary**.

## 💌 RSVP

The website includes a custom RSVP system that allows wedding guests to respond directly through the website.

### RSVP Form

Guests can submit their RSVP by filling out a form with information such as:

- Name
- Attendance
- Food preferences/allergies or other relevant information

The form is designed to be simple and accessible, allowing guests to submit their response without needing to create an account.

### 📊 Data Handling

Submitted RSVP responses are collected and stored in **Google Sheets**.

This made it possible to manage the guest list in one central location while keeping the website separate from the actual guest data.

The RSVP flow works approximately as follows:

```text
Guest
  ↓
RSVP Form
  ↓
Form validation
  ↓
Backend / API
  ↓
Google Sheets
  ↓
Guest response stored
 ```
## 🌐 Deployment

The website was deployed and hosted using [Render](https://render.com).

The application was deployed as a Node.js web service, providing both the website and its backend functionality.

### Production Environment

- **Hosting:** Render
- **Runtime:** Node.js
- **Backend:** Express
- **Data:** Google Sheets
- **Image storage:** Cloudinary
- **Configuration:** Environment variables

The website was publicly available to wedding guests during the wedding period.

**Live website:** [annajoel.se](https://annajoel.se)
