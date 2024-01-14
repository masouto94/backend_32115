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


const isAdmin = async (req, res, next) => {
    if(req.session.user.role === 'admin' ){
        return next()
    }
    return res.status(401).send({error:'Not Admin'})
}

const isUser = (req, res, next) => {
    if(req.session.user.role === 'user'){
        return next()
    }
    res.status(401).send({error:'Not an user'})
}

const loggedIn = (req, res, next) => {
    if(req.session.user){
        return next()
    }

    res.status(401).redirect("/login")
}
export {
    upload,
    isAdmin,
    isUser,
    loggedIn
}
