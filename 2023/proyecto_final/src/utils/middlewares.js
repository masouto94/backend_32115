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


const auth = (req, res, next) => {
    const {email, pass} = req.body
    if(email === 'admin@adminCoder.com' && pass === 'adminCod3r123' ){
        return next()
    }
    res.status(401).send('Not Admin')
}

export {
    upload,
    auth
}
