// =======================
// 1. IMPORTS
// =======================

const express = require('express');
const app = express();
const methodOverride = require("method-override");
const morgan = require("morgan");
require('dotenv').config()
const mongoose = require("mongoose")
const authController = require('./controllers/auth.js');
const reportController = require('./controllers/report.route.js')
const session = require('express-session');
const isSignedIn = require("./middleware/is-signed-in.js")
const passUserToView = require("./middleware/pass-user-to-view.js")
const User = require('./models/user.js')
// const reportController = require("./controllers/report.route.js")




// =======================
// 2. MIDDLEWARE
// =======================
app.use(express.urlencoded({ extended: false })); // parses the request body. Needed for the req.body
app.use(methodOverride("_method")); // Will change the methods for
app.use(morgan("dev")); // Logs the requests in the terminal


// =======================
// 3. CONNECTION TO DATABASE
// =======================
mongoose.connect(process.env.MONGODB_URI)
.then(()=>{console.log(`Connected to ${mongoose.connection.name} DATABSE.`)})
.catch(()=>{console.log(`ERROR CONNECTING TO DB ${mongoose.connection.name}.`)})

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
)

const path = require("path")
app.use(express.static(path.join(__dirname, "public")));


// app.use(passUserToView)





app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
)


app.use(passUserToView)








// =======================
// 4. ROUTES
// =======================


app.get('/', (req, res) => {
  if (req.session.user) {
    // res.redirect(`/users/${req.session.user._id}/applications`)
    res.render('index.ejs')
  } else {
    res.render('index.ejs')
  }
})

app.get('/page1', (req, res) => {
    res.render('page1.ejs')
})
app.get('/page2', (req, res) => {
  res.render('page2.ejs')
})
app.get('/page3', (req, res) => {
  res.render('page3.ejs')
})
app.get('/page4', (req, res) => {
  res.render('page4.ejs')
})
app.get('/page5', (req, res) => {
  res.render('page5.ejs')
})
app.get('/vets', (req, res) => {
  res.render('resources/vets.ejs')
})
app.get('/shelters', (req, res) => {
  res.render('resources/shelters.ejs')
})
app.get('/stores', (req, res) => {
  res.render('resources/stores.ejs')
})
app.get('/adaptInfo', (req, res) => {
  res.render('adapt/adaptInfo.ejs')
})
app.get('/tips', (req, res) => {
  res.render('resources/tips.ejs')
})


app.use('/auth', authController)

app.use(isSignedIn)

// app.use('/users/:userId/report', reportController)
app.use('/report', reportController)




// =======================
// 5. LISTENING ON PORT 3000
// =======================
app.listen(3000, () => {
  console.log('Listening on port 3000');

})

