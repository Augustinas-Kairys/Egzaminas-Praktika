import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

type MulterFile = Express.Multer.File;

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 }, 
  fileFilter: function (req: Request, file: MulterFile, cb: FileFilterCallback) {
    checkFileType(file, cb);
  }
}).single('photo'); 

function checkFileType(file: MulterFile, cb: FileFilterCallback) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images Only!'));
  }
}
