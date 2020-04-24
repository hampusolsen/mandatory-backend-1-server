const multer = require('multer');

const storage = multer.diskStorage({
   destination: (_req, _file, cb) => {
      cb(null, './uploads/');
   },
   filename: (_req, file, cb) => {
      cb(null, new Date().toISOString() + file.originalname);
   },
});

const fileFilter = (_req, file, cb) => {
   const mimetypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/gif'];
   if (mimetypes.include(file.mimetype)) {
      cb(null, true);
   } else {
      cb({ error: 'Invalid file type.' }, false);
   };
};

module.exports = multer({
   storage,
   fileFilter,
   limits: { fileSize: Math.pow(1024, 2) },
});