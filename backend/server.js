// server.js
const app = require('./app');
const express = require("express");
const cors = require("cors");
const admin = require('firebase-admin');
const PORT = process.env.PORT || 4000;
const serviceAccount = require('./green-travel-planner-firebase-adminsdk-eqs4r-3d9f20b34d');

// Middleware to authenticate Firebase token
const authenticateFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Authorization: Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach the user info to the request object
    next();
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
};

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Home route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verify email and password using Firebase Authentication
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);

    // If successful, get the ID token and send it to the client
    const idToken = await userCredential.user.getIdToken();
    res.json({ success: true, idToken });

  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});
