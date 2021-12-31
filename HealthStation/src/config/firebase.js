// import admin from 'firebase-admin'
const admin = require('firebase-admin')
const _ = require('lodash')
var serviceAccount = require('../../projectcovid-hcmus-firebase-adminsdk-7hpjv-bfc1315164.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const storageRef = admin.storage().bucket(`gs://projectcovid-hcmus.appspot.com/`);

const uploadFile = async (file) => {
    try {
        const storage = await storageRef.upload(file.path, {
            public: true,
            destination: `/uploads/${file.filename}`,
            metadata: {
                firebaseStorageDownloadTokens: _.uniqueId(file),
            }
        });

        return storage[0].metadata.mediaLink;
    }
    catch (error) {
        throw error
    }
}


const uploadMultipleFiles = async (files) => {

    try {
        let urls = []
        for (const file of files) {
            const url = await uploadFile(file)
            urls.push(url)
        }
        return urls
    }
    catch (error) {
        throw error
    }
}

const deleteFile = async(url) => {

    const nameIndex = url.indexOf('images')
    const extIndex = url.indexOf('.', nameIndex)
    const endingIndex = url.indexOf('?', extIndex)
    let path = '/uploads/'
    path += url.slice(nameIndex, endingIndex)
    try {
        await storageRef.file(path).delete()
    } catch(err) {
        console.log(err)
    }
}

const firebaseService = {
    uploadFile,
    uploadMultipleFiles,
    deleteFile
}

module.exports = firebaseService