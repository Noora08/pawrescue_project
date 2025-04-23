// =======================
// 1. IMPORTS
// =======================
require('dotenv').config()
const express = require('express');
const app = express();
const methodOverride = require("method-override");
const morgan = require("morgan");
const mongoose = require("mongoose");
const session = require('express-session');
const path = require("path");
const multer = require('multer');
const { MongoClient } = require("mongodb");

const authController = require('./controllers/auth.js');
const reportController = require('./controllers/report.route.js');
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");
const User = require('./models/user.js');

// =======================
// 2. MIDDLEWARE
// =======================
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use(passUserToView);
app.use(express.static(path.join(__dirname, "public")));

// =======================
// 3. CONNECTION TO DATABASE (Mongoose)
// =======================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(`Connected to ${mongoose.connection.name} DATABASE.`);
  })
  .catch((err) => {
    console.log("ERROR CONNECTING TO DB.", err.message);
  });

// =======================
// 4. ROUTES
// =======================
app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/page1', (req, res) => res.render('page1.ejs'));
app.get('/page2', (req, res) => res.render('page2.ejs'));
app.get('/page3', (req, res) => res.render('page3.ejs'));
app.get('/page4', (req, res) => res.render('page4.ejs'));
app.get('/page5', (req, res) => res.render('page5.ejs'));
app.get('/vets', (req, res) => res.render('resources/vets.ejs'));
app.get('/shelters', (req, res) => res.render('resources/shelters.ejs'));
app.get('/stores', (req, res) => res.render('resources/stores.ejs'));
app.get('/adaptInfo', (req, res) => res.render('adapt/adaptInfo.ejs'));

// ✅ FIXED /tips route to include searchQuery
app.get('/tips', (req, res) => {
  const searchQuery = req.query.search || '';
  res.render('resources/tips.ejs', { searchQuery });
});

app.use('/auth', authController);

app.use(isSignedIn); // Protect the following routes

app.use('/report', reportController);

// =======================
// 5. LISTENING ON PORT
// =======================
app.listen(3000, () => {
  console.log('Listening on port 3000');
});

// =======================
// 6. NATIVE MongoDB Client (optional)
// =======================
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

client.connect()
  .then(() => {
    console.log("Connected to MongoDB via native driver");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

// =======================
// 7. MULTER FILE UPLOAD SETUP
// =======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');  // This is where the uploaded files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Save file with timestamp
  }
});

const upload = multer({ storage: storage });

app.post('/your-upload-endpoint', upload.single('photo'), (req, res) => {
  console.log('File uploaded:', req.file);
  res.send('File uploaded successfully!');
});
