const express = require('express');
const path = require('path');
const admin = require('firebase-admin'); // Import Firebase Admin SDK
const fetch = require('node-fetch'); // To call Firebase REST API


const app = express();
const PORT = 3001;

// Initialize Firebase Admin SDK with the service account key
const serviceAccount = require('./talent-trade-prj-firebase-adminsdk-y17v4-0d68bcd8b5.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://talent-trade-prj-default-rtdb.firebaseio.com", // Replace with your Firebase Database URL
});

const auth = admin.auth();
const database = admin.database();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Firebase API key for REST API (replace with your project's API key)
const FIREBASE_API_KEY = 'AIzaSyDitBOm52MLo2HWYFZMeqPsIgPYhKiF61I';

// Routes for sign-up and sign-in pages

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home/home.html'));
});


app.get('/sign-up', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login/sign-up.html'));
});

app.get('/sign-in', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login/sign-in.html'));
});

app.get('/tsign-up', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'test-login/sign-up.html'));
});
  
app.get('/tsign-in', (req, res) => {
   res.sendFile(path.join(__dirname, 'public', 'test-login/sign-in.html'));
});

app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'common/common.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin/index.html'));
});
app.get('/tradechat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tradechat/index.html'));
});

app.get('/posttrade', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tradesboard/postatrade.html'));
});
app.post('/sign-up', async (req, res) => {
    const { email, password, name } = req.body;
  
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required.' });
    }
  
    try {
      // Create user with email and password
      const userRecord = await auth.createUser({ email, password });
  
      // Construct user data to store in the database
      const userData = {
        uid: userRecord.uid,
        email: userRecord.email,
        name,
      };
  
      // Write user data to Realtime Database
      await database.ref(`users/${userRecord.uid}`).set(userData);
  
      console.log(`User created successfully with UID: ${userRecord.uid}`);
      res.status(201).json({ message: 'User created successfully!' });
    } catch (error) {
      console.error('Error during sign-up:', error);
      res.status(500).json({ message: error.message });
    }
  });

// Handle sign-in
app.post('/sign-in', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Call Firebase Authentication REST API to validate email and password
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      res.status(200).send({
        message: 'Sign-in successful',
        email: data.email,
        idToken: data.idToken,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn,
      });
    } else {
      const error = await response.json();
      console.error('Error during sign-in:', error);
      res.status(401).send({ message: 'Invalid credentials', error });
    }
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).send('Error during sign-in');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
