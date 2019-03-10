const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

// bcrypt.genSalt(10,(err,salt)=>{
//     if(err) return err
//     bcrypt.hash("fiza123",salt,(err,hash)=>{
//         if(err) return err
//         console.log(hash)
//     })
// })

const id = 1000;
const secrete = "supersecret";

const recievedToken = "eyJhbGciOiJIUzI1NiJ9.MTAwMA.L9PmEqLlZjettygguzj25agunJu6NkvVtG9RFRBnK2Y"

const token = jwt.sign(id,secrete);
const decodeToken = jwt.verify(recievedToken,secrete)

console.log(decodeToken)