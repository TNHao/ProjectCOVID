const multer = require('multer')
const storage = multer.diskStorage({
        filename: function (req, file, cb) {
        const extArray = file.mimetype.split("/");
        const extension = extArray[extArray.length - 1];
        const name = (file.fieldname + '-' + Date.now() + '.' + extension)

        cb(null, name)
    }
})

const upload = multer({storage})

module.exports = upload