const express= require('express')
const router = express.Router();
const {body, validationResult}=require('express-validator')
const jwt=require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../utils/prisma');
const forgetEmail=require('../utils/resetPassSendEmail')
const sendEmail = require('../utils/sendEmail');
const JWT_SECRET_KEY=process.env.SUPER_SECRET_LOGIN_KEY
const JWT_EMAIL_VERIFICATION=process.env.JWT_SECRET_EMAIL_VERIFICATION
const JWT_FORGET_PASSWORD=process.env.JWT_SECRET_FORGET_PASSWORD

//registration API
router.post('/createuser',[body('email','Enter Valid Email').isEmail(), //This one Express Validetor Apply Kora hoice
     body('name','Enter Valid Name').isLength({min:3}),
      body('password', 'Enter Valid Password').isLength({min:5})],async(req,res)=>{
        const errors = validationResult(req); // Ekahne Validator er result display kora hoice
        if (!errors.isEmpty()) {
         return res.status(400).json({ faild: 'Something Went Wrong. Check Your Information', errors: errors.array() });}
            try{
                const {name,email,password}=req.body
                let dupUser= await prisma.user.findUnique({
                    where:{email}});
                    if(dupUser){return res.status(401).json({msg:'User already exisit'})}
                const salt= await bcrypt.genSalt(10)
                const secPass=await bcrypt.hash(password,salt)
                const userCount= await prisma.user.count()
                const countAdmin = userCount===0? 'ADMIN' : 'USER'
                  const newUser=  await prisma.user.create({ data:{
                    name, email,password:secPass, role:countAdmin,   isVerified :false }});
                    const payload={id:newUser.id}
                    const jwtToken= jwt.sign(payload,JWT_EMAIL_VERIFICATION,{expiresIn:'1h'})
                    await sendEmail(email, name, jwtToken);
                res.status(201).json({msg:'Account create success fully. Please Verify Your Email'})


            }catch(err){console.error(err); res.status(500).json({msg:'Server Error'})}
});


//SignIn Router.
router.post('/login',async(req,res)=>{

    try{
    
        const {email,password}=req.body
        const user = await prisma.user.findUnique({ where:{email} });
        if(!user){res.status(404).json({msg:'User not found'})}
        if(!user.isVerified){return res.status(400).json({msg:'Please Verify Your Email'})}
        const isMatch= await bcrypt.compare(password,user.password)
        if(!isMatch){res.status(400).json({msg:'Invalid username or passowrd'})}
        const payload={
            id:user.id,
            role:user.role
        }
        const token= jwt.sign(payload,JWT_SECRET_KEY,{expiresIn:'1d'})

        res.status(200).json({ token, role:user.role, msg:'Loging successfull'})
    }catch(err){console.error(err); res.status(500).json({msg:'Server Error'})}

});


//Email-Verification
router.get('/emailverification/:token', async(req,res)=>{
    try{
        const token= req.params.token
        const isMatch=jwt.verify(token,JWT_EMAIL_VERIFICATION);
        const user= await prisma.user.findUnique({
            where:{id:Number(isMatch.id)}});
         if(!user){ return res.status(404).send(`<html>
    <head>
      <title>Email Verified</title>
      <style>
        body {
          background: #f0f4f8;
          font-family: Arial;
          text-align: center;
          padding-top: 100px;
        }
        .card {
          display: inline-block;
          padding: 30px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 { color: #28a745; }
      </style>
      <script>
        setTimeout(() => {
          window.location.href = "https://localhost:5000/signup"; // বা তোমার client এর path
        }, 3000);
      </script>
    </head>
    <body>
      <div class="card">
        <h1> 👀 User Not Found!</h1>
      </div>
    </body>
  </html>`)};


        if(user.isVerified){return res.status(200).send(`<html>
    <head>
      <title>Email Verified</title>
      <style>
        body {
          background: #f0f4f8;
          font-family: Arial;
          text-align: center;
          padding-top: 100px;
        }
        .card {
          display: inline-block;
          padding: 30px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 { color: #28a745; }
      </style>
        <script>
        setTimeout(() => {
          window.location.href = "http://localhost:5173/signin"; // বা তোমার client এর path
        }, 3000);
      </script>
    </head>
    <body>
      <div class="card">
        <h1>✅ Email Allready Verified!</h1>
      </div>
    </body>
  </html>`)};
        await prisma.user.update({
            where:{id:Number(user.id)},
            data:{isVerified:true}
          });
        res.status(200).send(` <html>
    <head>
      <title>Email Verified</title>
      <style>
        body {
          background: #f0f4f8;
          font-family: Arial;
          text-align: center;
          padding-top: 100px;
        }
        .card {
          display: inline-block;
          padding: 30px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 { color: #28a745; }
      </style>
      <script>
        setTimeout(() => {
          window.location.href = "http://localhost:5173/signin"; // বা তোমার client এর path
        }, 3000);
      </script>
    </head>
    <body>
      <div class="card">
        <h1>✅ Email Verified Successfully!</h1>
      </div>
    </body>
  </html>`)
    }catch(err){console.error(err); res.status(500).json({msg:'Server Error'})}
});

//forgetPassword
router.post('/forget-password',[body('name', 'Enter Valid Name').isLength({min:3})],[body('email','Enter Valid Email').isEmail()], async (req,res)=>{

           const errors = validationResult(req); // Ekahne Validator er result display kora hoice
     if (!errors.isEmpty()) {
      return res.status(400).json({ msg: 'Something Went Wrong. Check Your Information', errors: errors.array() });
    }  
    const {email,name}= req.body;
    try{
        const user = await prisma.user.findUnique({
          where:{name,email}
        });
        if(!user){return res.status(404).json({msg:'User Not Found'})};
         const data ={
        id:user.id
        }   
        const tokenReset = jwt.sign(data,JWT_FORGET_PASSWORD,{expiresIn:'15m'});
   
           await forgetEmail(email, name, tokenReset )
            res.status(200).json({msg:'Reset Link Sent to Your Email'})

    }catch(error){console.error(error.message);
        res.status(500).json('Server Error')
    }
});

//verify forgetPassword
router.get('/reset-password/:token', async(req,res)=>{
    const token = req.params.token;
    try{
        const verifi = jwt.verify(token,JWT_FORGET_PASSWORD);
        res.send(`
             <html>
        <head><title>Reset Password</title></head>
        <body style="font-family:Arial;text-align:center;margin-top:50px">
        <div style="border:2px solid black; display: grid; grid-template-columns:400px; justify-content:center; ">
          <h2>Reset Your Password</h2>
          <form action="/api/auth/reset-password/${token}" method="POST">
            <input style="height:50px; width:300px; border:solid; padding-left:10px; border-radius:20px; padding-right:10px;" type="password" name="password" placeholder="Enter new password" required />
            <button style="height: 50px; width: 120px; margin-top:30px; border-radius:20px; font-size: 20px; border:none; background:green; color:White" type="submit">Submit</button>
          </form>
          </div>
        </body>
      </html>
            `)
    }catch(error){console.error(error.message)
        res.status(400).send('Expried Link')
    }
});

//resetPassword
router.post('/reset-password/:token', async(req,res)=>{
const token = req.params.token;
const {password} = req.body;
try{
    const verify = jwt.verify(token, JWT_FORGET_PASSWORD)
  const user = await prisma.user.findUnique({
    where:{id:verify.id}
  });
  if(!user){return res.status(400).send('User Not Found')}
  if(!password){return res.status(400).json('Password Is Required')}

  const salt = await bcrypt.genSalt(10)
  const SecPass = await bcrypt.hash(password,salt)
  await prisma.user.update({
    where:{id:user.id},
    data:{password:SecPass}
  });
  res.status(200).send(` <html>
    <head>
      <title>Email Verified</title>
      <style>
        body {
          background: #f0f4f8;
          font-family: Arial;
          text-align: center;
          padding-top: 100px;
        }
        .card {
          display: inline-block;
          padding: 30px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 { color: #28a745; }
      </style>
      <script>
        setTimeout(() => {
          window.location.href = "http://localhost:5173/signin"; // বা তোমার client এর path
        }, 3000);
      </script>
    </head>
    <body>
      <div class="card">
        <h1>✅ Your Password Has Been Changed Successfully!</h1>
      </div>
    </body>
  </html>`)
}catch(error){console.error(error.message);
    res.status(400).send('Expired Link')
}


});





//secrate add admin
router.put('/addadmin', async(res,req)=>{
    const {name,email,password,secretCode}=req.body
      if (secretCode !== process.env.ADMIN_SECRET_CODE) {
    return res.status(401).json({ msg: "❌ Invalid admin secret code!" });}
    const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ msg: "⚠️ User with this email already exists." });}

    const salt= await bcrypt.genSalt(10)
                const secPass=await bcrypt.hash(password,salt)
                const createUser= await prisma.user.create({ data:{
                    name, email,password:secPass, role:'ADMIN' }});
                res.status(201).json({createUser,msg:'Account create success fully'})
   
});
















module.exports=router