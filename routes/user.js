const express = require('express');
const router = express.Router();
const { getIndex, login } = require('../controllers/user');
const { getUpload, getImages, uploadFiles } = require('../controllers/images');
const isAuthenticated = require("../middleware/auth")


router.get('/', getIndex);
router.post('/login', login);

router.get('/upload', isAuthenticated, getUpload);
router.get('/images', isAuthenticated, getImages);
router.post('/upload', isAuthenticated, uploadFiles);

module.exports = router;
