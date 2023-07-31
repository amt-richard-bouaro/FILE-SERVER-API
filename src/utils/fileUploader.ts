
import multer from "multer";

const docsStorage = multer.diskStorage({
    destination: function (reg, file, callback) {
        callback(null, 'uploads/')
    },
    filename: function (reg, file, callback) { 
    
        const uniquePrefix = 'LCF-' + Math.round(Math.random() * 100000);

        

        callback(null, uniquePrefix + '-' + file.originalname);
    }
})


export const docUpload = multer({
    storage: docsStorage,
    limits: {
        fileSize: 20 * 1024 * 1024
    },
    fileFilter: (req, file, callback) =>{
         if (file.mimetype.split('/')[0] !== 'application') {      
          callback(new Error('Unsupported file type'))   
         } else {
             callback(null, true);
        }
    },
})