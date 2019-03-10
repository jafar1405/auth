const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {auth} = require('./middleware/middleware')

//mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/auth');

const { User } = require('./models/user')

app.use(bodyParser.json());
app.use(cookieParser())


app.post('/api/user',(req,res)=>{

    const user = new User(
        {
            email:req.body.email,
            password:req.body.password
        }
    )

    user.save((err,doc)=>{
        if(err) res.status(400).send(err)
        res.status(200).send(doc)
    })
})

app.post('/api/user/login',(req,res)=>{

    User.findOne({'email':req.body.email},(err, user)=>{
        if(!user) res.json({message:"Auth is not corret"})
        
        user.comparePassword(req.body.password,(err,isMatch)=>{
            if(err) throw err;
            if(!isMatch) return res.status(400).json({
                message:"wrong password"
            })
            user.generateToken((err,user)=>{
                if(err) return res.status(400).send(err)
                res.cookie('auth',user.token).send('ok')
            })
        })
    })
})

app.post('/api/user/profile',auth,(req,res)=>{
    res.status(200).send(req.token)        
})

let port = process.env.PORT || 8080;
app.listen(port,()=>{
    console.log(`server running on port ${port}`)
})