const express = require('express');
const path = require('path');
const admin = require('firebase-admin'); // Import Firebase Admin SDK
const fetch = require('node-fetch'); // To call Firebase REST API
const cookieParser = require('cookie-parser');


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
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Firebase API key for REST API (replace with your project's API key)
const FIREBASE_API_KEY = 'AIzaSyDitBOm52MLo2HWYFZMeqPsIgPYhKiF61I';



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home/home.html'));
});

app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home/search.html'));
});

app.get('/new-page', (req, res) => {
  const sname = req.query.sname; 
  const description = req.query.description;
  const experience = req.query.experience;
  const hourlyRate = req.query.hourlyRate;
  const contactEmail = req.query.contactEmail;
  const socialMedia = req.query.socialMedia;
  const upiID = req.query.upiID;
  const uid = req.query.uid;
  const category = req.query.category;
  const name = req.query.name;
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Trade Details</title>
        <style>
            body {
                margin: 0;
                font-family: Arial, sans-serif;
                background: radial-gradient(circle at bottom left, #4b0082, transparent 60%),
                            radial-gradient(circle at top right, #4b0082, transparent 60%),
                            #000033;
                color: white;
                padding: 20px;
                box-sizing: border-box;
                line-height: 1.6;
            }
    
            .container {
                max-width: 800px;
                margin: 50px auto;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 30px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
    
            .header {
                text-align: center;
                color: #ffd700;
                font-size: 2rem;
                margin-bottom: 30px;
                text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
            }
    
            .trade-detail {
                display: flex;
                justify-content: space-between;
                padding: 15px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
    
            .trade-label {
                font-weight: bold;
                color: #ffd700;
                flex: 1;
            }
    
            .trade-value {
                color: #ccc;
                flex: 1;
                text-align: right;
            }
    
            .trade-value a {
                color: #7f00ff;
                text-decoration: none;
                transition: color 0.3s ease;
            }
    
            .trade-value a:hover {
                color: #4b0082;
                text-decoration: underline;
            }
    
            .button-container {
                text-align: center;
                margin-top: 30px;
            }
    
            .back-button {
                display: inline-block;
                padding: 12px 25px;
                margin: 10px;
                text-align: center;
                text-decoration: none;
                color: white;
                background-color: #7f00ff;
                border-radius: 5px;
                border: none;
                cursor: pointer;
                transition: background-color 0.3s ease;
                font-size: 1rem;
            }
    
            .back-button:hover {
                background-color: #4b0082;
            }
    
            .logo-container {
                padding: 20px;
            }
    
            .logo {
                width: 150px;
                height: auto;
            }
    
            .back-btn {
                position: absolute;
                top: 130px;
                left: 50px;
                padding: 10px 20px;
                background-color: rgba(255, 255, 255, 0.1);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s ease;
            }
    
            .back-btn:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }
        </style>
    </head>
    <body>
        <footer>
            <div class="logo-container">
                <img src="/images/logo.png" alt="Logo" class="logo">
            </div>
        </footer>
        
        <button onclick="history.back()" class="back-btn">← Back</button>
    
        <div class="container">
            <div class="header">Trade Details</div>
            
            <div class="trade-detail"><span class="trade-label">Trade Owner Name:</span><span class="trade-value">${name}</span></div>
            <div class="trade-detail"><span class="trade-label">Trade Name:</span><span class="trade-value">${sname}</span></div>
            <div class="trade-detail"><span class="trade-label">Trade Description:</span><span class="trade-value">${description}</span></div>
            <div class="trade-detail"><span class="trade-label">Experience Level:</span><span class="trade-value">${experience}</span></div>
            <div class="trade-detail"><span class="trade-label">Hourly Rate (₹):</span><span class="trade-value">${hourlyRate}</span></div>
            <div class="trade-detail"><span class="trade-label">Contact Number:</span><span class="trade-value">${contactEmail}</span></div>
            <div class="trade-detail"><span class="trade-label">Instagram Link:</span><span class="trade-value"><a href="${socialMedia}" target="_blank">${socialMedia}</a></span></div>
            <div class="trade-detail"><span class="trade-label">Category:</span><span class="trade-value">${category}</span></div>
            <div class="trade-detail"><span class="trade-label">UPI ID:</span><span class="trade-value">${upiID}</span></div>
            
            <div class="button-container">
                <a href="#" class="back-button" onclick="sendWhatsAppMessage()">Chat With User</a>
                <a onclick="history.back()" class="back-button">Go Back</a>
            </div>
        </div>
    
        <script>
            function sendWhatsAppMessage() {
                console.log("Chatting...");
                window.location.href = \`https://wa.me/91${contactEmail}?text=Hi ${name}, I need the skill ${sname} from you. Can you give more details? %0A From Talent Trade\`;
            }
        </script>
    </body>
    </html>
    `);
});

app.get('/userr/:uid', async (req, res) => {
  try {
      const uid = req.params.uid;
      const userSnapshot = await db.ref(`users/${uid}`).once('value');
      const userData = userSnapshot.val();

      if (!userData) {
          return res.status(404).send('User not found');
      }

      res.render('user_details', { user: { uid, ...userData } });
  } catch (error) {
      res.status(500).send('Error retrieving user data');
  }
});

app.get('/user/:uid', (req, res) => {
  const { uid } = req.params;  // Get the uid from the request params

  // Reference to the user data in the Realtime Database
  const userRef = database.ref(`users/${uid}`);

  // Retrieve user data from the database
  userRef.once('value', (snapshot) => {
      const userData = snapshot.val();

      if (userData) {
          res.json({
              biography: userData.biography,
              email: userData.email,
              name: userData.name,
              phoneNumber: userData.phoneNumber,
              socialMedia: userData.socialMedia,
              uid: userData.uid,
              upiID: userData.upiID,
              website: userData.website,
              college: userData.college,
              admin: userData.admin,
              ustatus: userData.ustatus
               // Add more fields if needed
          });
      } else {
          res.status(404).json({ message: 'User not found' });
      }
  }).catch((error) => {
      res.status(500).json({ message: 'Error fetching user data' });
  });
});






// Middleware to check user ban status
const checkBanStatus = async (req, res, next) => {
  const uid = req.cookies.uid;
  if (!uid) {
    return next();
  }

  try {
    const userSnapshot = await database.ref(`users/${uid}`).once('value');
    const userData = userSnapshot.val();
    
    if (userData && userData.ustatus === 'banned') {
      return res.redirect('/banned'); // Redirect to banned page
    }
    } catch (error) {
    console.error('Error checking ban status:', error);
    }
    next();
  };

  // Add route for banned page
  app.get('/banned', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'banned.html'));
  });

  // Apply middleware to all routes except sign-in and sign-up
  app.use((req, res, next) => {
    if (req.path === '/sign-in' || req.path === '/sign-up' || req.path === '/ssign-in' || req.path === '/ssign-up' || req.path === '/banned') {
    return next();
    }
    checkBanStatus(req, res, next);
  });

  // Modify sign-in route to check ban status
  app.post('/sign-in', async (req, res) => {
    const { email, password } = req.body;

    try {
      // First check if user exists and is banned
      const userRecord = await admin.auth().getUserByEmail(email);
      const userSnapshot = await database.ref(`users/${userRecord.uid}`).once('value');
      const userData = userSnapshot.val();

      if (userData && userData.ustatus === 'banned') {
        return res.status(403).json({ message: 'Account is banned', redirect: '/banned' });
      }

      // Continue with normal sign-in flow...
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, returnSecureToken: true }),
        }
      );

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      res.cookie('uid', data.localId, { httpOnly: true, secure: true });
      res.status(200).json({
        message: 'Sign-in successful',
        email: data.email,
        idToken: data.idToken,
      });
      } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(401).json({ message: 'Authentication failed' });
      }
    });






app.get('/ssign-up', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login/sign-up.html'));
});

app.get('/ssign-in', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login/sign-in.html'));
});

app.get('/sign-up', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login/sign-up.html'));
});

app.get('/check-sign', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login/check-sign.html'));
});
  
app.get('/sign-in', (req, res) => {
   res.sendFile(path.join(__dirname, 'public', 'login/sign-in.html'));
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

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile/profile.html'));
});

app.get('/mytrades', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tradesboard/mytrades.html'));
});

app.get('/myrequest', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tradesboard/myrequest.html'));
});

app.get('/updateprofile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile/updateprofile.html'));
});

app.get('/profilemanage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile/profilecreation.html'));
});

app.get('/notification', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notification/index.html'));
});


app.get('/technicalskills', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tradesboard/technicalskills.html'));
});

app.get('/creativeskills', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tradesboard/creative.html'));
});

app.get('/academickills', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tradesboard/academic.html'));
});

app.get('/social', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tradesboard/social.html'));
});

app.get('/showmytrades', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tradesboard/showmytrades.html'));
});

app.get('/showmyrequests', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tradesboard/showmyrequests.html'));
});

app.get('/tradedetails', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tradesboard/tradedetails.html'));
});

app.get('/forgotpass', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login/forgot-pass.html'));
});

app.get('/dispute', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dispute.html/index.html'));
});

// Middleware to check if user is admin
const checkAdmin = async (req, res, next) => {
  const uid = req.cookies.uid;
  if (!uid) {
    return res.redirect('/');
  }

  try {
    const userSnapshot = await database.ref(`users/${uid}`).once('value');
    const userData = userSnapshot.val();
    
    if (!userData || userData.admin !== 'yes') {
      return res.redirect('/home');
    }
    next();
  } catch (error) {
    console.error('Error checking admin status:', error);
    res.redirect('/');
  }
};

// Admin Page routes with admin check middleware
app.get('/allreq', checkAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin/allrequests.html'));
});

app.get('/alltr', checkAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin/alltrades.html'));
});

app.get('/alltdr', checkAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin/alltrds.html')); 
});

app.get('/alluser', checkAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin/allusers.html'));
});

app.get('/alldisputes', checkAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin/disputes.html'));
});




app.get('/enterotp', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login/enterotp.html'));
});
app.get('/genarate-link', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login/genarate-link.js'));
});

app.get('/all-trades', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tradesboard/all-trades.html'));
});

app.get('/showdispute', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dispute.html/disputeStatus.html'));
});

app.get('/tandc', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 't&c.html'));
});



app.post('/post-trade', async (req, res) => {
  const { skillName, description, experience, hourlyRate, contactEmail, socialMedia, upiID, email, password, name, uidd, category } = req.body;

  try {
    // Create a new reference with generated ID
    const newPostRef = database.ref('Post Trade').push();
    
    // Get the generated ID
    const postId = newPostRef.key;

    // Construct user data with ID
    const userData = {
      id: postId,
      skillName: skillName,
      description: description,
      experience: experience,
      hourlyRate: hourlyRate,
      contactEmail: contactEmail,
      socialMedia: socialMedia,
      upiID: upiID,
      uid: uidd,
      category: category,
      verification: 'no',
      name: name
    };

    // Write user data to the new reference
    await newPostRef.set(userData);

    console.log(`Post created successfully with ID: ${postId}`);
    res.status(201).json({ 
      message: 'Post created successfully!',
      postId: postId
    });
  } catch (error) {
    console.error('Error during trade creation:', error);
    res.status(500).json({ message: error.message });
  }
});








// Endpoint to post disputes
app.post('/post-dispute', async (req, res) => {
  const { transactionId, disputeType, description, attachments } = req.body;
  const uid = req.cookies.uid;

  if (!uid) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  if (!transactionId || !disputeType || !description) {
    return res.status(400).json({ message: 'Required fields missing' });
  }

  try {
    const newDisputeRef = database.ref('Disputes').push();
    const disputeId = newDisputeRef.key;

    const disputeData = {
      id: disputeId,
      transactionId,
      disputeType,
      description,
      attachments: attachments || null,
      status: 'pending',
      createdAt: new Date().toISOString(),
      uid
    };

    await newDisputeRef.set(disputeData);
    res.status(201).json({ message: 'Dispute created successfully', disputeId });
  } catch (error) {
    console.error('Error creating dispute:', error);
    res.status(500).json({ message: 'Error creating dispute' });
  }
});

app.get('/get-trades', async (_req, res) => {
  try {
    const tradesSnapshot = await database.ref('Post Trade').once('value');
    const trades = tradesSnapshot.val();

    if (!trades) {
      return res.status(404).json({ message: 'No trades found.' });
    }

    const tradeList = Object.values(trades).map(trade => ({
      id: trade.id,
      skillName: trade.skillName,
      description: trade.description,
      experience: trade.experience,
      hourlyRate: trade.hourlyRate,
      category: trade.category,
      contactEmail: trade.contactEmail,
      socialMedia: trade.socialMedia,
      upiID: trade.upiID,
      uid: trade.uid,
      name: trade.name,
      verification: trade.verification
    }));

    res.status(200).json(tradeList);
  } catch (error) {
    console.error('Error retrieving trades:', error);
    res.status(500).json({ message: error.message });
  }
});








app.get('/get-tradesss', async (req, res) => {
  try {
    const tradesSnapshot = await database.ref('Post Trade').once('value');
    const trades = tradesSnapshot.val();

    if (!trades) {
      return res.status(404).json({ message: 'No trades found.' });
    }

    const tradeList = Object.entries(trades)
      .filter(([_, trade]) => trade.verification === 'yes')
      .map(([id, trade]) => ({
        id,
        ...trade
      }));

    res.status(200).json(tradeList);
  } catch (error) {
    console.error('Error retrieving trades:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/get-tradess', async (req, res) => {
  try {
    const tradesSnapshot = await database.ref('Post Trade').once('value');
    const trades = tradesSnapshot.val();

    if (!trades) {
      return res.status(404).json({ message: 'No trades found.' });
    }

    const tradeList = Object.entries(trades)
      .filter(([_, trade]) => trade.verification === 'no')
      .map(([id, trade]) => ({
        id,
        ...trade
      }));

    res.status(200).json(tradeList);
  } catch (error) {
    console.error('Error retrieving trades:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/verify-trade/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await database.ref(`Post Trade/${id}`).update({ verification: 'yes' });
    res.status(200).json({ message: 'Trade verified successfully' });
  } catch (error) {
    console.error('Error verifying trade:', error);
    res.status(500).json({ message: error.message });
  }
});

app.delete('/delete-trade/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await database.ref(`Post Trade/${id}`).remove();
    res.status(200).json({ message: 'Trade deleted successfully' });
  } catch (error) {
    console.error('Error deleting trade:', error);
    res.status(500).json({ message: error.message });
  }
});


// Middleware to check if user is signed in
const checkSignedIn = async (req, res, next) => {
  const uid = req.cookies.uid;

  if (!uid) {
    return res.status(401).json({ message: 'User not signed in.' });
  }

  try {
    // Verify user exists in the database
    const userSnapshot = await admin.database().ref(`users/${uid}`).once('value');
    if (!userSnapshot.exists()) {
      return res.status(401).json({ message: 'Invalid user session.' });
    }

    req.user = userSnapshot.val(); // Attach user data to the request object
    next();
  } catch (error) {
    console.error('Error checking user session:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};



app.post('/create-profile', async (req, res) => {
  const { fullName, email, phoneNumber, biography, socialMedia, website, upiID, college, uidd} = req.body;

  if (!fullName || !email || !phoneNumber || !biography) {
    return res.status(400).json({ message: 'Required fields are missing!' });
  }

  try {
    const userData = {
      email: email,
      name: fullName,
      phoneNumber: phoneNumber,
      biography:biography,
      socialMedia:socialMedia,
      website:website,
      college:college,
      upiID:upiID,
      uidd:uid
    };

    await admin.database().ref(`users/${uidd}`).set(userData);

    // Set UID as a cookie
   

    console.log(`User created successfully with UID: ${uidd}`);
    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    console.error('Error during creation:', error);
    res.status(500).json({ message: error.message });
  }
});






// Sign-up route
app.post('/sign-up', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Email, password, and name are required.' });
  }

  try {
    const userRecord = await admin.auth().createUser({ email, password });
    const userData = {
      uid: userRecord.uid,
      email: userRecord.email,
      name,
    };

    await admin.database().ref(`users/${userRecord.uid}`).set(userData);

    // Set UID as a cookie
    res.cookie('uid', userRecord.uid, { httpOnly: true, secure: true });

    console.log(`User created successfully with UID: ${userRecord.uid}`);
    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    console.error('Error during sign-up:', error);
    res.status(500).json({ message: error.message });
  }
});

// Check if the user is signed in
app.get('/check-signed-in', checkSignedIn, (req, res) => {
  res.status(200).json({ message: 'User is signed in.', user: req.user });
});

// Sign-out route
app.post('/sign-out', (req, res) => {
  res.clearCookie('uid');
  res.status(200).json({ message: 'User signed out successfully.' });
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

      // Set UID as a cookie
      res.cookie('uid', data.localId, { httpOnly: true, secure: true });
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
  