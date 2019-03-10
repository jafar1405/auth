const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const SALT_I = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    email:{
        type:String,
        trim:true,
        required:true,
        unique:1
    },
    password:{
        type:String,
        required:true,
        minlength:6
    }
});

userSchema.pre('save',function(next){
    var user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(SALT_I,function(err,salt){
            if(err) console.log(err)
            bcrypt.hash(user.password,salt,function(err,hash){
                if(err) console.log(err)
                user.password = hash;
                next()
            })
        })
    }else{
        next()
    }
})

userSchema.methods.comparePassword = function(candidatePassword,cb){
    bcrypt.compare(candidatePassword,this.password,(err,isMatch)=>{
        if(err) throw cb(err);
        cb(null,isMatch)
    })
}

userSchema.methods.generateToken = function(cb){
    var user = this;
    var token = jwt.sign(user._id.toHexString(),'supersecret')
    
    user.token = token;
    user.save(function(err,user){
        if(err) return cb(err);
        cb(null,user)
    })
}

userSchema.statics.findByToken = function(token,cb){
    var user = this;
    jwt.verify(token,'supersecret',function(err,decode){
        user.findOne({"_id":decode},(err,user)=>{
            if(err) return cb(err)
            cb(null,user)            
        })
    })
}

const User = mongoose.model('User',userSchema);

module.exports = { User }