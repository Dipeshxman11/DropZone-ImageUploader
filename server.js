// Require necessary modules
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Initialize Express app
const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Mock authenticated users
const users = [
  { id: '1', username: 'Binary', password: 'binary123' },
  { id: '2', username: 'User2', password: 'password2' }

];

// Configure Passport.js for user authentication
passport.use(new LocalStrategy((username, password, done) => {
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    return done(null, user);
  }
  return done(null, false);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id);
  done(null, user);
});

// Middleware for file size validation (< 2MB)
const fileFilter = (req, file, cb) => {
    if (!req.headers['content-length'] || parseInt(req.headers['content-length']) <= 2 * 1024 * 1024) {
      cb(null, true);
    } else {
      cb(new Error('File size exceeds the limit (2MB)'));
    }
  };

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = path.join(__dirname, 'uploads', req.user.username);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true }); // Create directory recursively
    }
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/upload',
  failureRedirect: '/'
}));

app.get('/upload', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'upload.html'));
});

app.get('/images', isAuthenticated, (req, res) => {
  const userDir = path.join(__dirname, 'uploads', req.user.username);
  fs.readdir(userDir, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      res.status(500).send('Error reading directory');
    } else {
      res.send(files);
    }
  });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/upload', isAuthenticated, upload.array('file'), (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send('No files uploaded');
    }
    console.log('Files uploaded:', req.files);
    res.send('Files uploaded successfully');
  });
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
