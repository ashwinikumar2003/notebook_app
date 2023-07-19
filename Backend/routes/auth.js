import { Router } from "express"
import { body, validationResult } from 'express-validator';
import User from '../models/userSchema.js';
import Notes from '../models/notesSchema.js';
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'

const router = Router()
const secret = "thesecret"

const generateToken = (user_id)=>{
    const token = jwt.sign({user_id}, secret, {expiresIn: "1d"})
    return token
}

const checkToken = (req,res,next)=>{
    let token = req.header("auth-token")
    if(!token){
        return res.status(401).json({message: "Unauthorized"})
    }
    try {
        let decodedToken = jwt.verify(token, secret);
        req.user_id = decodedToken.user_id;
    
        next();
    } catch {
        return res.status(401).json({
          message: "Unauthorized!",
        })
    }
}

router.get("/", (res)=>{
    res.json({
        message:"api working fine!"
    })
})

router.post('/register', [
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters long')
  ], (req, res) => {

    const errors = validationResult(req);
    const errorMessages = errors.array().map((error) => error.msg)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errorMessages})
    }

    User.findOne({email:req.body.email})
    .then((data,err)=>{
        if(err){
            return res.status(500).json({message: "Internal server error"})
        }
        if(data){
            return res.status(409).json({message: "This email already exists!"})
        }
        else{
            const salt = bcrypt.genSaltSync(10)
            const hashedPass = bcrypt.hashSync(req.body.password, salt)

            User.create({
                name: req.body.name,
                email: req.body.email,
                password: hashedPass,
            })
            .then((data) => {
                return res.json({
                    message: "User created successfully!",
                    user: data,
                    token: generateToken(data._id)
                });
            })
            .catch((err) => {
                return res.status(500).json({ message: err })
            })
        }
    })
})

router.post('/login',[
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').exists().withMessage('Password cannot be empty'),
], (req,res)=>{
    const errors = validationResult(req);
    const errorMessages = errors.array().map((error) => error.msg);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errorMessages})
    }

    User.findOne({email:req.body.email}).then((data,err)=>{
        if(err){
            return res.status(500).json({message:"Internal server error"})
        }
        if(data){
            const isMatch = bcrypt.compareSync(req.body.password, data.password)

            if(isMatch){
                return res.status(200).json({
                    message:"User validated successfully!",
                    token:generateToken(data._id)
                })
            }
            else{
                return res.status(401).json({message:"Invalid credentials"})
            }
        }
        else{
            return res.status(404).json({message:"User not found!"})
        }
    })
})

router.get("/get-user", checkToken, (req,res)=>{
    const user_id = req.user_id
    User.findById(user_id).then((data)=>{
        if(!data){
            return res.status(404).json({message:"User not found!"})
        }
        if(data){
            return res.status(200).json({
                message:"User fetched successfully!",
                user: data
            })
        }
    }).catch((error)=>{
        console.error(error)
        return res.status(500).json({message:"Internal server error"})
    })
})

router.get('/get-notes', checkToken, (req,res)=>{
    Notes.find({userid:req.user_id})
    .then((data)=>{
        if(!data){
            return res.status(404).json({message:"Notes not found"})
        }
        if(data){
            return res.status(200).json({
                message:"Notes fetched successfully!",
                notes:data
            })
        }
    }).catch((err)=>{
        console.error(err)
        return res.status(500).json({message:"Internal server error"})
    })
})

router.post('/add-note',checkToken ,[
    body('title').isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
    body('description').isLength({min:5}).withMessage('Description must be atleast 5 characters'),
    body('tags')
], (req,res)=>{
    const errors = validationResult(req);
    const errorMessages = errors.array().map((error) => error.msg)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errorMessages})
    }

    const {title, description, tags} = req.body
    Notes.create({
        title, description, tags, userid:req.user_id
    }).then((data)=>{
        if(data){
            return res.status(200).json({
                message:"Notes added successfully!",
                notes:data
            })
        }
    }).catch((err)=>{
        console.error(err)
        return res.status(500).json({message:"Internal server error"})
    })
})

router.delete('/delete-note/:notes_id', checkToken, (req,res)=>{
    const notes_id = req.params.notes_id
    Notes.findById({_id: notes_id})
    .then((data)=>{
        if(data){
            if(data.userid !== req.user_id){
                return res.status(404).json({
                    message: "Note not found!",
                })
            }
            else{
                Notes.findByIdAndDelete({_id:notes_id})
                .then((data)=>{
                    if (data) {
                        return res.status(200).json({
                            message: "Note deleted successfully!",
                            note: data
                        })
                    }
                }).catch((err)=>{
                    console.error(err)
                    return res.status(500).json({message:"Internal server error"})
                })
            }
        }
    })
})

router.patch('/update-note/:notes_id', checkToken, (req,res)=>{
    const {title, description, tags} = req.body

    const patch = {}
    if(title){patch.title=title}
    if(description){patch.description=description}
    if(tags){patch.tags=tags}

    Notes.findById({_id: req.params.notes_id})
    .then((data)=>{
        if(data){
            if(data.userid !== req.user_id){
                return res.status(404).json({
                    message: "Note not found!",
                })
            }
            else{
                Notes.findByIdAndUpdate(req.params.notes_id,
                {$set:patch},{new:true}
                ).then((data)=>{
                    if (data) {
                        return res.status(200).json({
                          message: "Note updated successfully!",
                          note: data
                        })
                    }
                }).catch((err)=>{
                    console.error(err)
                    return res.status(500).json({message:"Internal server error"})
                })
            }
        }
    }).catch((err)=>{
        console.error(err)
        return res.status(500).json({message:"Internal server error"})
    })
})

export default router