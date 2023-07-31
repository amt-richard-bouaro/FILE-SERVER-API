
import multer from "multer";
import multerS3 from 'multer-s3';
// import  aws  from 'aws-sdk';
import { S3_BUCKET } from "../config";
import { S3Client } from '@aws-sdk/client-s3';

const s3 = new S3Client({
    region: S3_BUCKET.REGION,
    credentials: {
        accessKeyId: S3_BUCKET.ACCESS_KEY,
        secretAccessKey: S3_BUCKET.SECRET_KEY
    },
});


const storage = multerS3({
    s3,
    bucket: S3_BUCKET.NAME,
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (reg, file, callback) {

        const uniquePrefix = 'LCF-' + Math.round(Math.random() * 100000);

        callback(null, uniquePrefix + '-' + file.originalname);
    }
});

const docsStorage = multer.diskStorage({
    destination: function (reg, file, callback) {
        callback(null, 'src/uploads/')
    },
    filename: function (reg, file, callback) {

        const uniquePrefix = 'LCF-' + Math.round(Math.random() * 100000);



        callback(null, uniquePrefix + '-' + file.originalname);
    }
})


export const docUpload = multer({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024
    },
    fileFilter: (req, file, callback) => {
        if (file.mimetype.split('/')[0] !== 'application') {
            callback(new Error('Unsupported file type'))
        } else {
            callback(null, true);
        }
    },
})