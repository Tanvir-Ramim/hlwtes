const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  //   destination: "image/",
  destination: path.join(__dirname, ".store/image/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

//upload.fields([{ name: 'pdfFile', maxCount: 1 }, { name: 'imageFile', maxCount: 1 }])
//imageUpload.array('images', 4)
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 300000, 
  },
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

//     if (!allowedTypes.includes(file.mimetype)) {
//       const error = new Error("Invalid file type");
//       error.code = "INVALID_FILE_TYPE";
//       return cb(error, false);
//     }

//     cb(null, true);
//   },
});

module.exports = upload;
