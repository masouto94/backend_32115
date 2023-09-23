import multer from 'multer'

const storage = multer.diskStorage({
    destination: (req,file, cb) =>{
        cb(null, 'src/public/img')
    },
    filename: (req,file, cb) =>{
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})
const upload = multer({storage:storage})

export {
    upload
}