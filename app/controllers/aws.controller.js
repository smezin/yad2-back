const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const fileFilter = require('../middleware/awsFileFilter')
const s3 = new aws.S3();

aws.config.update({
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  region: process.env.AWS_REGION,
});


const upload = multer({
  fileFilter,
  storage: multerS3({
    acl: 'public-read',
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

const deleteImage = (imageKey) => {
  const bucketInstance = new aws.S3();
  const params = {
      Bucket:  process.env.AWS_BUCKET_NAME,
      Key: imageKey
  };
  bucketInstance.deleteObject(params, function (err, data) {
      if (data) {
          console.log("File deleted successfully"); //check it out
      }
      else {
          console.log("Check if you have sufficient permissions : "+err);
      }
  });
}
module.exports = {
  upload,
  deleteImage
}