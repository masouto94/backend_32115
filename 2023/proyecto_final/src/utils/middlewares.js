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
    try {
        if(req.session.user.role === 'admin' ){
        return next()
        }
    }
    catch(error){
        return res.status(500).send({error:error.message})    
    }
    return res.status(401).send({error:'Not Admin'})
}

const isUser = (req, res, next) => {
    try{
        if(req.session.user.role === 'user'){
        return next()
        }
    }
    catch(error){
        return res.status(500).send({error:error.message})    
    }
    res.status(401).send({error:'Not an user'})
}

const loggedIn = (req, res, next) => {
    try {
        if(req.session.user || req.headers.authorization === process.env.SESSION_SECRET){
        return next()
        }
    }
    catch(error){
        return res.status(500).send({error:error.message})    
    }

    res.status(401).redirect("/login")
}
export {
    upload,
    isAdmin,
    isUser,
    loggedIn
}
