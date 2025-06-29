const express= require('express');
const router = express.Router();
const roleAuthriz=require('../middle-wear/roleAuthriz');
const verificatio=require('../middle-wear/verification');
const prisma = require('../utils/prisma');
const {body, validationResult}=require('express-validator')
const upload = require('../middle-wear/multar')
const cloudinary=require('../utils/cloudinaryConfig');




// Post Blog
router.post('/addblog',verificatio,roleAuthriz('AUTHOR'),upload.single('photos'),[body('title').isLength({min:3}),body('description').isLength({min:3}),
body('content').isLength({min:3})],async(req,res)=>{
    
     const errors = validationResult(req); // Ekahne Validator er result display kora hoice
        if (!errors.isEmpty()) {
        return res.status(400).json({ faild: 'Something Went Wrong. Check Your Information', errors: errors.array() });}
    try{
        const {title, description, content, visibility}=req.body
        
       
        if(!title || !description || !content || !visibility ){return res.status(401).json({msg:'All field required'})}
        if(!['PRIVATE','PUBLIC'].includes(visibility)){return res.status(402).json({msg:'Select Private or Public'})}
    const User=  await prisma.user.findUnique({
        where:{
            id:Number(req.user.id)
        }
    });
    if(!User){return res.status(404).json({msg:'User not found'})}
    const result = await cloudinary.uploader.upload(req.file.path,{
        folder:'Nest-Blog/blog-photos',
        width: 400,
        height: 250,
       
    });

    const blog= await prisma.post.create({
      
        data:{
            title,description,content, 
            authorId: User.id,
            photos: result.secure_url,
            publicId:result.public_id,
            visibility: visibility,
        }
    });
    const fs=require('fs');
    fs.unlink(req.file.path, (err)=>{if(err)console.error(err);})
    res.status(200).json({msg:'Your Post Uploaded successfully'})
}catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});



//Upload NewPhoto
router.put('/uploadnewphoto/:id',verificatio,roleAuthriz('AUTHOR'),upload.single('photos'),async(req,res)=>{
    try{
       
    const User= await prisma.user.findUnique({
        where:{
            id:Number(req.user.id)
        }
    });
   if(!User){return res.status(404).json({msg:'User not found'})}
   const post= await prisma.post.findUnique({
    where:{
        id:Number(req.params.id)
    }
   })
   if(post?.publicId){await cloudinary.uploader.destroy(post.publicId)}
   const result=await cloudinary.uploader.upload(req.file.path,{
         folder:'Nest-Blog/blog-photos',
        width: 400,
        height: 250,
   })
   await prisma.post.update({
    where:{
        id:Number(req.params.id)
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

//get all public for edit
router.get('/getallpublicedit/:id', verificatio, roleAuthriz('AUTHOR'), async(req,res)=>{
    try{
    const User =await prisma.user.findUnique({
        where:{
            id:Number(req.user.id)
        }
    });
    if(!User){return res.status(404).json({msg:'User not found'})}

    const post =  await prisma.post.findUnique({
        where:{
            authorId: User.id,
            id: Number(req.params.id)
        },
        select:{
            title:true,
            description: true,
            content: true,
        }
    });
    if(!post){return res.status(400).json({msg: 'Post Not Available'})}
    res.status(200).json(post)
    }catch(error){console.log(error); res.status(500).json({msg:'Server Error'})}
})

//get for show full content
router.get('/getallpublicshow/:id', verificatio, roleAuthriz('AUTHOR'), async(req,res)=>{
    try{
    const User =await prisma.user.findUnique({
        where:{
            id:Number(req.user.id)
        }
    });
    if(!User){return res.status(404).json({msg:'User not found'})}

    const post =  await prisma.post.findUnique({
        where:{
            authorId: User.id,
            id: Number(req.params.id)
        },
        select:{
            title:true,
            description: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            id: true,
            visibility:true,
            viewCount: true,
            author:{
                select:{
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });
    if(!post){return res.status(400).json({msg: 'Post Not Available'})}
    res.status(200).json(post)
    }catch(error){console.log(error); res.status(500).json({msg:'Server Error'})}
})


//Get All Public Blog
router.get('/getallpublicblogs',verificatio,roleAuthriz('AUTHOR'),async(req,res)=>{
    try{
         const page = Number(req.query.page) || 1;
        const limit= Number(req.query.limit) || 6;
        const skip = (page-1)*limit
        const total= await prisma.post.count({
            where:{
                visibility: 'PUBLIC',
                authorId:Number(req.user.id)
            }
        });
        
    const User= await prisma.user.findUnique({
        where:{
           
            id:Number(req.user.id)
        }
    });
    if(!User){return res.status(404).json({msg:'User not found'})}
    
    const allpublicblog= await prisma.post.findMany({
        where:{
            visibility: 'PUBLIC',
            authorId:User.id,
        },
        select:{
            title: true,
            description:true,
            content: true,
            photos:true,
            id: true,
            createdAt: true,
            updatedAt: true
        },
        skip:skip,
        take: limit,
        orderBy:{
        createdAt: 'desc'
       }
    });
    res.status(200).json({allpublicblog, totalPage:Math.ceil(total/limit)})
 }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}

});

//get all private blog
router.get('/getallprivateblogs',verificatio,roleAuthriz('AUTHOR'),async(req,res)=>{
    try{
        const total= await prisma.post.count({
            where:{
                visibility: 'PRIVATE',
                authorId:Number(req.user.id)
            }
        })
         const page = Number(req.query.page) || 1;
        const limit= req.query.limit || 6;
        const skip = (page-1)*limit
    const User= await prisma.user.findUnique({
        where:{
           
            id:Number(req.user.id)
        }
    });
    if(!User){return res.status(404).json({msg:'User not found'})}
    
    const allprivateblog= await prisma.post.findMany({
        where:{
            visibility: 'PRIVATE',
            authorId:User.id
        },
        select:{
            title: true,
            description:true,
            content: true,
            photos:true,
            id: true,
            createdAt: true,
            updatedAt: true
        },
        skip:skip,
        take: limit,
        orderBy:{
        createdAt: 'desc'
       }
    });
    res.status(200).json({allprivateblog, totalPage: Math.ceil(total/limit)})
 }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}

});




//deletePost
router.delete('/deleteauthorpost/:id',verificatio,roleAuthriz('AUTHOR'),async(req,res)=>{
    try{
    const User= await prisma.user.findUnique({
        where:{
            id:Number(req.user.id)
        }
    });
    if(!User){return res.status(404).json({msg:'User not founded'})}
    const post = await prisma.post.findUnique({
        where:{
            id:Number(req.params.id)
        }
    });
    if (!post){return res.status(404).json({msg:'No post founded'})}
       if(post.authorId !== User.id){return res.status(401).json({msg:'Access not allowd'})}
       if(post.publicId){
    await cloudinary.uploader.destroy(post.publicId)}
    await prisma.post.delete({
        where:{
            id:Number(req.params.id)
        }
   
    });
    res.status(200).json({msg:'Post deleted successfully'})
}catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//Update blogs
router.put('/updateauthorpost/:id',verificatio,roleAuthriz('AUTHOR'),async(req,res)=>{
    try{
    const {title,description,content,visibility}=req.body
      const User= await prisma.user.findUnique({
        where:{
            id:Number(req.user.id)
        }
    });
    if(!User){return res.status(404).json({msg:'User not founded'})}

    const post = await prisma.post.findUnique({
        where:{
            id:Number(req.params.id)
        }
    });
    if (!post){return res.status(404).json({msg:'No post founded'})}
       if(post.authorId !== User.id){return res.status(400).json({msg:'Access not allowd'})}
       if(!['PRIVATE','PUBLIC'].includes(visibility)){return res.status(401).json({msg:'Select Private or public'})}
       await prisma.post.update({
        where:{
            id:Number(req.params.id)
        },
        data:{
            title,
            description,
            content,
            visibility
        }
       });
       res.status(200).json({msg:'Your post updated'})
       }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});


//Search Public Blog post by post Id
router.get('/searchpublicpost',verificatio,roleAuthriz('AUTHOR'),async(req,res)=>{
const rawQuery = req.query.query || '';
const query = rawQuery.trim();
const id = Number( query)
try{
    const User = await prisma.user.findUnique({
        where:{id:Number(req.user.id)}
    })
if(!query||isNaN(id)||id<=0){return res.status(400).json({msg:'Invalid Input'})}
const Post = await prisma.post.findUnique({
    where:{authorId:User.id, visibility:'PUBLIC', id},
    select:{
            title: true,
            description:true,
            content: true,
            photos:true,
            id: true,
            createdAt: true,
            updatedAt: true
        },
});
if(!Post){return res.status(404).json({msg:'Post Not Found'})}
res.status(200).json(Post)
}catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//search PrivatePost by post ID:

router.get('/searchprivatepost',verificatio,roleAuthriz('AUTHOR'),async(req,res)=>{
const rawQuery = req.query.query || '';
const query = rawQuery.trim();
const id = Number( query)
try{
    const User = await prisma.user.findUnique({
        where:{id:Number(req.user.id)}
    })
if(!query||isNaN(id)||id<=0){return res.status(400).json({msg:'Invalid Input'})}
const Post = await prisma.post.findUnique({
    where:{authorId:User.id, visibility:'PRIVATE', id},
    select:{
            title: true,
            description:true,
            content: true,
            photos:true,
            id: true,
            createdAt: true,
            updatedAt: true
        },
});
if(!Post){return res.status(404).json({msg:'Post Not Found'})}
res.status(200).json(Post)
}catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

 
module.exports=router

