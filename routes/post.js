const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {isLoggedIn} = require("../middlewares");

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.log('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage : multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb)  {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits : { filesize : 5 * 1024 * 1024 }
})

router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage);

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), uploadPost);

router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage);
