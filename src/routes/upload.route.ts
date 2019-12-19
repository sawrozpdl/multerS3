const express = require('express');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const uploadRoute = express.Router();

require('dotenv').config();

/**
 * s3 bucket configuration
 */
const s3 = new aws.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    Bucket: process.env.BUCKET_NAME
});


export function getExtention(fileName:string):string { // file.jpg returns .jpg
    let array =  fileName.split('.');
    return array[array.length - 1];
}

export function getFileName(fileName:string):string { // file.jpg returns file
    let array =  fileName.split('.');
    return array[0];
}

/**
 * Single Upload
 */
const uploader = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'com.lftechnology.vyaguta.photos',
        acl: 'public-read',
        key: function (req: Express.Request, file: Express.Multer.File, cb: any) {
            cb(null, `${getFileName(file.originalname)}.${Date.now()}.${getExtention(file.originalname)}`)
        }
    }),
    limits: { fileSize: 5000000 }, // bytes
    fileFilter: function (req: Express.Request, file: Express.Multer.File, cb: any) {

        // filtering code here
        // cb('unsupported') if file extention does not match required one:

        if (['jpg', 'png', 'jpeg'].includes(getExtention(file.originalname)))
            cb(null, true)
        else cb('Unsupported Image Format!')
    }
});


// this return a middleware
const imageUpload = uploader.single('userimage');

/**
 * On diskStorage, we didn't have to worry about error handling but this case, there could be expired tokens 
 * and all also, we need the url of the image to store in database so, we need to provide our error function as well.
 */
uploadRoute.route('/').post((req: any, res: any, next: any) => {
    imageUpload(req, res, (error: any) => {
        if (error) {
            res.json({ error });
        } else {
            if (req.file === undefined) {
                res.json({error : 'Image not found!'});
            } else {
                const imageName = req.file.key;
                const imageLocation = req.file.location;
                res.json({
                    image: imageName,
                    location: imageLocation
                });
            }
        }
    })
});

export default uploadRoute;