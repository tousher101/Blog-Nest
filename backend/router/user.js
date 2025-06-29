const express= require('express');
const router = express.Router();
const roleAuthriz=require('../middle-wear/roleAuthriz');
const verificatio=require('../middle-wear/verification');
const prisma = require('../utils/prisma');
const isPremium=require('../middle-wear/isPremium');
const {body, validationResult}=require('express-validator')

//Get All Free Post
router.get('/getpublicpost', verificatio,roleAuthriz('USER'),async(req,res)=>{
    const total = await prisma.post.count({
        where:{
           visibility:'PUBLIC'  
        }
    });
    const limit = req.query.limit || 12;
    const page = req.query.page || 1;
    const skip = (page -1)*limit;
        try{
          
    const pubPost = await prisma.post.findMany({
        where:{
            visibility:'PUBLIC' 
        },
        select:{
           title: true,
            description: true,
            photos: true,
            createdAt: true,
            updatedAt: true,
            id: true,
            author:{
                select:{
                    name:true,
                    id:true
                }
        
                 }, 
        },
        skip: skip,
        take: limit,
        orderBy:{
        createdAt: 'desc'
       }
    });
    res.status(200).json({pubPost, totalPage:Math.ceil(total/limit)})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});


//Get All Privet Post
router.get('/getprivatepost', verificatio,roleAuthriz('USER'),async(req,res)=>{
   
        const total = await prisma.post.count({
        where:{
           visibility:'PRIVATE'  
        }
    });
    const limit = req.query.limit || 12;
    const page = req.query.page || 1;
    const skip = (page -1)*limit;
    try{

    const User= await prisma.user.findUnique({
        where:{
            id:Number(req.user.id)
        },
        select:{
            isPremium:true
        }
    });
    const privatePost = await prisma.post.findMany({
        where:{
            visibility:'PRIVATE',
           
        },
          select: {
  title: true,
  description: true,
  photos: true,
  createdAt: true,
  updatedAt: true,
  id: true,
  author: {
    select: {
      name: true,
      id: true
    }
  }
},
        skip: skip,
        take: limit,
        orderBy:{
        createdAt: 'desc'
       }
    });
    res.status(200).json({privatePost, totalPage:Math.ceil(total/limit),User})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});


//show  full all public post
router.get('/showpublicpost/:id', verificatio,roleAuthriz('USER'),async(req,res)=>{
        try{
              const viewCount= await prisma.post.update({
                where:{visibility:'PUBLIC', id:Number(req.params.id)},
                data:{
                    viewCount: {increment:1}
                }
            });
    const pubPost = await prisma.post.findUnique({
        where:{
            visibility:'PUBLIC' ,
            id: Number(req.params.id)
        },
        select:{
           title: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            id: true,
            content: true,
            visibility: true,
            viewCount: true,
            author:{
                select:{
                    name:true,
                    id: true
                }
        
                 }, 
        },
    });
    res.status(200).json(pubPost)
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//Show full All Private/Paid Post:
router.get('/showprivatepost/:id', verificatio,roleAuthriz('USER'),isPremium,async(req,res)=>{
        try{
               const viewCount= await prisma.post.update({
                where:{visibility:'PRIVATE', id:Number(req.params.id)},
                data:{
                    viewCount: {increment:1}
                }
            });
            const User = await prisma.user.findUnique({
                where:{
                    id:Number(req.user.id)
                }
            })
    if(!User.isPremium){return res.status(400).json({msg:'Acces not allowed! Please Purches Premium Subscription'})}
    const priPost = await prisma.post.findUnique({
        where:{
            visibility:'PRIVATE' ,
            id: Number(req.params.id)
        },
        select:{
           title: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            id: true,
            content: true,
            visibility: true,
            viewCount: true,
            author:{
                select:{
                    name:true,
                   id: true
                }
        
                 }, 
        },
    });
    res.status(200).json(priPost)
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});






// Request for Author
router.post('/authorrequest',verificatio,roleAuthriz('USER'), async(req,res)=>{
    try{
    const User= await prisma.user.update({
        where:{
            id:Number(req.user.id) 
        },
        data:{
             authorRequest: true
        }
    });
    res.status(200).json({msg:'Request Sent Successfully'});
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//Search Public Post by author Id

router.get('/searchpublicpost', verificatio,roleAuthriz('USER'),async(req,res)=>{
    const rawQuery=req.query.query || '';
    const quray=rawQuery.trim();
    const id =Number(quray);
    try{
        const page = Number(req.query.page)||1;
        const limit = Number(req.query.limit)||12;
        const skip = (page-1)*limit;
       const total = await prisma.post.count({
            where:{visibility:'PUBLIC', authorId:id}
        });
if(isNaN(id)||id<=0||!id){return res.status(400).json({msg:'Invalid Input'})};
const author = await prisma.user.findUnique({
    where:{id}
});
if(!author||author.role !=='AUTHOR'){return res.status(404).json({msg:'Author Not Found'})}
const Post = await prisma.post.findMany({
    where:{visibility:'PUBLIC', authorId:id},
      select:{
           title: true,
            description: true,
            photos: true,
            createdAt: true,
            updatedAt: true,
            id: true,
            author:{
                select:{
                    name:true,
                    id:true
                }
        
                 }, 
        },
        skip:skip,
        take:limit,
        orderBy:{createdAt:'desc'}
});
if(Post.length === 0){return res.status(404).json({msg:'Post Not Found'})}
res.status(200).json({Post, totalPage:Math.ceil(total/limit)})
}catch(err){console.error(err); res.status(500).json({msg:'Server Error'})}
});

//Search PrivatePost by authorId:
router.get('/searchprivatepost', verificatio,roleAuthriz('USER'),async(req,res)=>{
    const rawQuery=req.query.query || '';
    const quray=rawQuery.trim();
    const id =Number(quray);
    try{
        const page = Number(req.query.page)||1;
        const limit = Number(req.query.limit)||12;
        const skip = (page-1)*limit;
       const total = await prisma.post.count({
            where:{visibility:'PRIVATE', authorId:id}
        });
if(isNaN(id)||id<=0||!id){return res.status(400).json({msg:'Invalid Input'})};
const author = await prisma.user.findUnique({
    where:{id}
});
if(!author||author.role !== 'AUTHOR'){return res.status(404).json({msg:'Author Not Found'})}
const Post = await prisma.post.findMany({
    where:{visibility:'PRIVATE', authorId:id},
      select:{
           title: true,
            description: true,
            photos: true,
            createdAt: true,
            updatedAt: true,
            id: true,
            author:{
                select:{
                    name:true,
                    id:true
                }
        
                 }, 
        },
        skip:skip,
        take:limit,
        orderBy:{createdAt:'desc'}
});
if(Post.length === 0){return res.status(404).json({msg:'Post Not Found'})}
res.status(200).json({Post, totalPage:Math.ceil(total/limit)})
}catch(err){console.error(err); res.status(500).json({msg:'Server Error'})}
});


//Upload User Information
router.put('/userphoneupdate', verificatio,async(req,res)=>{
    const {phone}=req.body
    try{
        if(!phone){return res.status(400).json({msg:'Input Valid Phone Number'})}
        const User= await prisma.user.findUnique({
            where:{id: req.user.id}
        });
        if(!User){return res.status(404).json({msg:'User Not Found'})}
        await prisma.user.update({
            where:{id: req.user.id},
            data:{phone}
        });
        res.status(200).json({msg:'Phone Number Updated'})

    }catch(err){console.error(err); res.status(500).json({msg:'Server Erron'})}

});

router.put('/useraddressupdate', verificatio,async(req,res)=>{
    const {address}=req.body
    try{
        if(!address){return res.status(400).json({msg:'Input Valid Address'})}
        const User= await prisma.user.findUnique({
            where:{id: req.user.id}
        });
        if(!User){return res.status(404).json({msg:'User Not Found'})}
        await prisma.user.update({
            where:{id: req.user.id},
            data:{address}
        });
        res.status(200).json({msg:'Address Updated'})

    }catch(err){console.error(err); res.status(500).json({msg:'Server Erron'})}

});

router.put('/usergenderupdate', verificatio,async(req,res)=>{
    const {gender}=req.body
    try{
        if(!gender){return res.status(400).json({msg:'Input Valid Gender'})}
        const User= await prisma.user.findUnique({
            where:{id: req.user.id}
        });
        if(!User){return res.status(404).json({msg:'User Not Found'})}
        await prisma.user.update({
            where:{id: req.user.id},
            data:{gender}
        });
        res.status(200).json({msg:'Gender Updated'})

    }catch(err){console.error(err); res.status(500).json({msg:'Server Erron'})}

});

router.put('/userbioupdate', verificatio,async(req,res)=>{
    const {bio}=req.body
    try{
        if(!bio){return res.status(400).json({msg:'Input Valid bio'})}
        const User= await prisma.user.findUnique({
            where:{id: req.user.id}
        });
        if(!User){return res.status(404).json({msg:'User Not Found'})}
        await prisma.user.update({
            where:{id: req.user.id},
            data:{bio}
        });
        res.status(200).json({msg:'Bio Updated'})

    }catch(err){console.error(err); res.status(500).json({msg:'Server Erron'})}

});

router.put('/userinterestedupdate', verificatio,async(req,res)=>{
    const {interested}=req.body
    try{
        if(!interested){return res.status(400).json({msg:'Input Valid interest'})}
        const User= await prisma.user.findUnique({
            where:{id: req.user.id}
        });
        if(!User){return res.status(404).json({msg:'User Not Found'})}
        await prisma.user.update({
            where:{id: req.user.id},
            data:{interested}
        });
        res.status(200).json({msg:'Interest Updated'})

    }catch(err){console.error(err); res.status(500).json({msg:'Server Erron'})}

});




module.exports=router