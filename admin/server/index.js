// index.js
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Load the service account key. Ensure the path is correct.
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors({ origin: true }));
app.use(express.json());
// Middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Route to render the admin tool UI
app.get('/', (req, res) => {
  // Pass null for message and error on initial load
  res.render('admin', { message: null, error: null });
});

// This is the route to set a user's admin claim.
// It now handles form submission and renders a response.
app.post('/set-admin-claim', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).render('admin', { message: null, error: 'Email is required.' });
    }

    // 1. Find the user by email
    const user = await admin.auth().getUserByEmail(email);

    // 2. Set the custom claim on their user record.
    // The "admin: true" is a key-value pair that will be added to the user's ID token.
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });

    // 3. Optional: Revoke the current ID token so a new one is issued with the claim.
    // This forces a claim update for the client on their next refresh.
    await admin.auth().revokeRefreshTokens(user.uid);

    const successMessage = `Success! Custom claim 'admin: true' set for user ${email}.`;
    res.render('admin', { message: successMessage, error: null });
  } catch (error) {
    console.error('Error setting custom claim:', error);
    const errorMessage = `Failed to set custom claim. Error: ${error.message}`;
    res.status(500).render('admin', { message: null, error: errorMessage });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Admin tool is running on http://localhost:${PORT}`);
});