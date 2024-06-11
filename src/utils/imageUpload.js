const multer = require("multer");
const fileFilter = (req, file, cb) => {

  if (file.mimetype.startsWith("image/")) {
    cb(null, true); 
  } else {
    cb(new Error("Only images are allowed"), false); 
  }
};


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter 
});

module.exports = upload;
