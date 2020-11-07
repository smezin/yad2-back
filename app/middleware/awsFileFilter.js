const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    error.warn('user tried to upload invalid file type (not jpg/png)')
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};
module.exports = fileFilter