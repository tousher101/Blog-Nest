const express= require('express')
const router = express.Router();
const prisma = require('../utils/prisma');
const verificatio=require('../middle-wear/verification');
const upload = require('../middle-wear/multar')
const cloudinary=require('../utils/cloudinaryConfig');


router.put('/uploaduserphoto',verificatio,upload.single('photos'),async(req,res)=>{

    try{
    const User= await prisma.user.findUnique({
        where:{
            id:Number(req.user.id)
        }
    });
   if(!User){return res.status(404).json({msg:'User not found'})}
   if(User?.publicId){await cloudinary.uploader.destroy(User.publicId )}
   const result= await cloudinary.uploader.upload(req.file.path,{
    folder: 'Nest-Blog/profile-photo',
    width: 70,
    height: 70,
    
   });
   await prisma.user.update({
    where:{
        id:Number(req.user.id)
    },
    data:{
        photos: result.secure_url,
        publicId: result.public_id

    }
   });
    const fs=require('fs');
    fs.unlink(req.file.path, (err)=>{if(err)console.error(err);})
   res.status(200).json({msg:'Your photo upload successfuly'})
 }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

// Get All User Info:
router.get('/getalluser',verificatio, async(req,res)=>{
    try{
        const User= await prisma.user.findUnique({
            where:{
                id:Number(req.user.id)
            },
            select:{
                name: true,
                email: true,
                role: true,
                id:true,
                photos: true,
                isPremium: true,
                phone: true,
                address: true,
                bio: true,
                gender: true,
                interested: true,
                isVerified: true,
            }
        })
        res.status(200).json({User})

    }catch(err){console.error(err)}
});






module.exports=router