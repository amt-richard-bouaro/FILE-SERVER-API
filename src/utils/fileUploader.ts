
import multer from "multer";
import path from "path";

const docsStorage = multer.diskStorage({
    destination: function (reg, file, callback) {
        callback(null, 'src/Uploads/')
    },
    filename: function (reg, file, callback) { 

        // console.log(file);
        
               
        const uniquePrefix = 'LCF-' + Math.round(Math.random() * 100000);

        

        callback(null, uniquePrefix + '-' + file.originalname);
    }
})


export const docUpload = multer({
    storage: docsStorage,
})