const path = require('path');
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userDir = path.join(__dirname, '..', 'uploads', req.user.username);
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }
        cb(null, userDir);
    },
    filename: (req, file, cb) => {
        const date = new Date().toISOString().replace(/:/g, '-');
        cb(null, date + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }
});

exports.getUpload = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'upload.html'));
};

exports.getImages = (req, res) => {
    const userDir = path.join(__dirname, '..', 'uploads', req.user.username);
    fs.readdir(userDir, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            res.status(500).send('Error reading directory');
        } else {
            res.send(files);
        }
    });
};

exports.uploadFiles = async (req, res) => {
    try {
        await new Promise((resolve, reject) => {
            upload.array('file')(req, res, (err) => {
                if (err instanceof multer.MulterError) {
                    reject(new Error('File size exceeds the limit (2MB)'));
                } else if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        if (!req.files || req.files.length === 0) {
            return res.status(400).send('No files uploaded');
        }

        console.log('Files uploaded:', req.files);
        res.send('Files uploaded successfully');
    } catch (err) {
        console.error('Error uploading files:', err);
        res.status(500).send('An error occurred');
    }
};
