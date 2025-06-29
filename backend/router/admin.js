const express= require('express');
const router = express.Router();
const roleAuthriz=require('../middle-wear/roleAuthriz');
const verificatio=require('../middle-wear/verification');
const prisma = require('../utils/prisma');
const cloudinary = require('../utils/cloudinaryConfig')


//get all uers
router.get('/getuser',verificatio,roleAuthriz('ADMIN'),async(req,res)=>{
    try{
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page-1)*limit;
        const total= await prisma.user.count({
            where:{
               role: 'USER'
            }
        })
        const users= await prisma.user.findMany({
            where:{
                role:'USER'
            },
            select:{
                name: true,
                email: true,
                id:true
            },
            skip: skip,
            take: limit,
               orderBy:{
                    createdAt: 'desc'
                    }

        })
        res.status(200).json({users, totUserPage:Math.ceil(total/limit)})

    }catch(err){console.error(err)}
});

//delete user by Admin
router.delete('/deleteuser/:id',verificatio,roleAuthriz('ADMIN'),async(req,res)=>{
    try{
        const id=req.params.id
        const user= await prisma.user.findUnique({
            where:{
               id:Number(id)
            }
        });
        if(!user){return res.status(404).json({msg: 'User not found'})}
        if(user?.publicId){await cloudinary.uploader.destroy(user.publicId)}
      await  prisma.user.delete({
        where:{
            id:Number(id)
        }
      });
        res.status(200).json({msg:'User delete successfuly'})
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

// Role Change Author-User
router.put('/roledemotion/:id',verificatio,roleAuthriz('ADMIN'),async(req,res)=>{
    const role= 'USER'
    const id=req.params.id
    try{
    const user= await prisma.user.findUnique({
        where:{
            id:Number(id)
        }
    });
    if (!user){return res.status(404).json({msg:'User not found'})}
    if(user.role !== 'AUTHOR'){return res.status(401).json({msg:'Not Allowd to demoted'})}
    await prisma.user.update({
        where:{
            id:Number(id),
            
        },
        data:{
            role:role
        }
    });
    res.status(200).json({msg: 'User demoted successfuly'})
    }catch(err){console.error(err); res.status(500).json({msg:'Server Error'})}
});

//Author Request Render
router.get('/authorRequest/',verificatio,roleAuthriz('ADMIN'),async(req,res)=>{
    
   try{
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page-1)*limit;
    const authorRequest=await prisma.user.findMany({
        where:{authorRequest: true, role: 'USER'},
        select:{name:true, email:true, id:true},
        skip:skip,
        take:limit,
        orderBy:{createdAt: 'desc'}
    });

    const totalReq= await prisma.user.count({
        where:{
            authorRequest: true, role:'USER'
        },
    })
    res.status(200).json({authorRequest,totalReq, totalPage:Math.ceil(totalReq/limit)})
   }catch(err){console.error(err); res.status(500).json({msg:'Server Error'})}

});

//getAll Author
router.get('/allauthor',verificatio,roleAuthriz('ADMIN'),async(req,res)=>{
       try{
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page-1)*limit;
        const total = await prisma.user.count({
            where:{role:'AUTHOR'}
        })
        
    const author=await prisma.user.findMany({
        where:{role: 'AUTHOR'},
        select:{name:true, email:true, id:true},
        skip: skip,
        take: limit,
        orderBy:{createdAt:'desc'}
    });
    res.status(200).json({author, totalPage:Math.ceil(total/limit)})
   }catch(err){console.error(err); res.status(500).json({msg:'Server Error'})}
});

// totalUser/totalAuthor/totalPost/totalPost/totalprimium member
router.get('/getalldata',verificatio,roleAuthriz('ADMIN'),async(req,res)=>{

    try{
    const totalUser= await prisma.user.count({
        where:{
            role: 'USER'
        }
    });
    const totalAuthor= await prisma.user.count({
        where:{
            role: 'AUTHOR'
        }
    });
    const totalPost= await prisma.post.count({
        where:{
            OR:[{visibility: 'PRIVATE'},
            {visibility: 'PUBLIC'}]
            
        }
    });

    const totalpremium= await prisma.user.count({
        where:{
            isPremium: true
        }
    })
  
      
    res.status(200).json({totalUser, totalPost, totalAuthor, totalPost, totalpremium})
}catch(err){console.error(err); res.status(500).json({msg:'Server Error'})}
});

// Get All Post for ShowMore
router.get('/getalladminshow/:id',verificatio,roleAuthriz('ADMIN'),async(req,res)=>{
    try{

   
        const Post = await prisma.post.findUnique({
            where:{
                id: Number(req.params.id)
            }
        });
        if(!Post){return res.status(404).json({msg:'Post not found'})}
   
    const getPost = await prisma.post.findUnique({
        where:{
         id:Number(req.params.id)
        },
       select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        content: true,
        visibility:true,
        viewCount:true,
        author:{
            select:{
                name: true,
                id: true,
                email: true,
            }
        }
       }
    });
    res.status(200).json(getPost)
    }catch(err){console.error(err); res.status(500).json({msg:'Server Error'})}
});







//Get all public post data for Card
router.get('/getallpublicpost',verificatio,roleAuthriz('ADMIN'),async(req,res)=>{
    try{
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 6;
        const skip = (page-1)*limit;
        const total= await prisma.post.count({
            where:{
                visibility: 'PUBLIC'
            }
        });
    const allPublicPost = await prisma.post.findMany({
        where:{
            visibility: 'PUBLIC'
        },
       select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        photos: true,
        author:{
            select:{
                name: true,
                id: true,
                email: true,
            }
        }
       },
       skip:skip,
       take: limit,
       orderBy:{
        createdAt: 'desc'

       }
    });
    res.status(200).json({allPublicPost, totalPage:Math.ceil(total/limit)})
    }catch(err){console.error(err); res.status(500).json({msg:'Server Error'})}
});


//Get all Private post data for Card
router.get('/getallprivatepost',verificatio,roleAuthriz('ADMIN'),async(req,res)=>{
    try{
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 6;
        const skip = (page-1)*limit;
        const total= await prisma.post.count({
            where:{
                visibility: 'PRIVATE'
            }
        });
    const allPrivatePost = await prisma.post.findMany({
        where:{
            visibility: 'PRIVATE'
        },
       select: {
        id: true,
        photos: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        author:{
            select:{
                name: true,
                id: true,
                email: true,
            }
        }
       },
       skip:skip,
       take: limit,
       orderBy:{
        createdAt: 'desc'

       }
    });
    res.status(200).json({allPrivatePost, totalPage:Math.ceil(total/limit)})
    }catch(err){console.error(err); res.status(500).json({msg:'Server Error'})}
});

//Delete Author Post for ABUSE
router.delete('/deletepost/:id', verificatio, roleAuthriz('ADMIN'), async(req,res)=>{

    try{
    const Post = await prisma.post.findUnique({
        where:{
            id:Number(req.params.id)
        }
    });
    if(!Post){return res.status(404).json({msg:'Post not found'})}
    if(Post?.publicId){await cloudinary.uploader.destroy(Post.publicId)}
 

    await prisma.post.delete({
        where:{
            id:Number(req.params.id)
        }
    });
    res.status(200).json({msg:'Post Delete Successfuly'})
    }catch(err){console.error(err); res.status(500).json({msg:'Server Error'})}
});

//Approved Authour for approved button
router.put('/approvedauthor/:id',verificatio,roleAuthriz('ADMIN'),async(req,res)=>{
    try{
    const User= await prisma.user.update({
        where:{
            id:Number(req.params.id)
        },
        data:{
            role:'AUTHOR',
            authorRequest: false,
        },
    });
    res.status(200).json({msg:'Author Role Granted'})
    }catch(err){console.error(err); res.status(500).json({msg:'Server Error'})}
});

// Decline Author Request for decline button
router.put('/declineauthor/:id', verificatio,roleAuthriz('ADMIN'),async(req,res)=>{
     try{
    const User= await prisma.user.update({
        where:{
            id:Number(req.params.id)
        },
        data:{
            role: 'USER',
            authorRequest: false,
        },
    });
    res.status(200).json({msg:'Author Role Not Granted'})
    }catch(err){console.error(err); res.status(500).json({msg:'Server Error'})}

});

//Search User
router.get('/searchuser', verificatio, roleAuthriz('ADMIN'),async(req,res)=>{
  const rawQuery = req.query.query || '';
  const query = rawQuery.trim();
  const id= Number(query)
    try{
        if(!query||isNaN(id)||id<=0){return res.status(400).json({msg:'Invalid Input'})}
        const User = await prisma.user.findUnique({
            where:{id,role:'USER'},
             select: {name:true, email:true, id:true},
          
        });

        if(!User){return res.status(404).json({msg:'User Not Founded'})}
        res.status(200).json({User})

    }catch(error){console.error(error); res.status(500).json({msg:'Server Error'})}
});

//Search Author:
router.get('/searchauthor', verificatio, roleAuthriz('ADMIN'),async(req,res)=>{
  const rawQuery = req.query.query || '';
  const query = rawQuery.trim();
  const id= Number(query)
    try{
        if(!query||isNaN(id)||id<=0){return res.status(400).json({msg:'Invalid Input'})}
        const User = await prisma.user.findUnique({
            where:{id,role:'AUTHOR'},
             select: {name:true, email:true, id:true},
          
        });

        if(!User){return res.status(404).json({msg:'User Not Founded'})}
        res.status(200).json({User})

    }catch(error){console.error(error); res.status(500).json({msg:'Server Error'})}
});

//Search for AuthorReq:

router.get('/searchauthorreq', verificatio, roleAuthriz('ADMIN'),async(req,res)=>{
  const rawQuery = req.query.query || '';
  const query = rawQuery.trim();
  const id= Number(query)
    try{
        if(!query||isNaN(id)||id<=0){return res.status(400).json({msg:'Invalid Input'})}
        const User = await prisma.user.findUnique({
            where:{id,role:'USER',authorRequest: true},
             select: {name:true, email:true, id:true},
          
        });

        if(!User){return res.status(404).json({msg:'User Not Founded'})}
        res.status(200).json({User})

    }catch(error){console.error(error); res.status(500).json({msg:'Server Error'})}
});

//Search Public/Post By Author ID
router.get('/searchpublicpost', verificatio, roleAuthriz('ADMIN'),async(req,res)=>{

  const rawQuery = req.query.query || '';
  const query = rawQuery.trim();
  const id= Number(query)
    try{
        const page= req.query.page || 1;
        const limit = req.query.limit || 1
        const skip = (page-1)*limit
        const total = await prisma.post.count({
            where:{ visibility: 'PUBLIC', authorId:id },
        });
       const Author = await prisma.user.findUnique({
        where:{id}
       });
       if(!Author||Author.role !== 'AUTHOR'){return res.status(404).json({msg:' Author Not Founded'})}
    
        if(!query||isNaN(id)||id<=0){return res.status(400).json({msg:'Invalid Input'})}
        const Post = await prisma.post.findMany({
            where:{ visibility: 'PUBLIC', authorId:id },
          select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        photos: true,
        author:{
            select:{
                name: true,
                id: true,
                email: true,
            }
        }
       },
       skip: skip,
       take: limit,
       orderBy:{createdAt:'desc'}
          
        });
        if(Post.length === 0){return res.status(404).json({msg:'Post Not Founded'})}
     
        res.status(200).json({Post, totalPage:Math.ceil(total/limit)})

    }catch(error){console.error(error); res.status(500).json({msg:'Server Error'})}
});

//search privatePost

router.get('/searchprivatepost', verificatio, roleAuthriz('ADMIN'),async(req,res)=>{
  const rawQuery = req.query.query || '';
  const query = rawQuery.trim();
  const id= Number(query)
    try{
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 12;
        const skip= (page-1)*limit;
        const total = await prisma.post.count({
            where:{ visibility: 'PRIVATE', authorId:id },
        });
       const Author = await prisma.user.findUnique({
        where:{id}
       });
       if(!Author||Author.role !== 'AUTHOR'){return res.status(404).json({msg:' Author Not Founded'})}
    
        if(!query||isNaN(id)||id<=0){return res.status(400).json({msg:'Invalid Input'})}
        const Post = await prisma.post.findMany({
            where:{ visibility: 'PRIVATE', authorId:id },
          select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        photos: true,
        author:{
            select:{
                name: true,
                id: true,
                email: true,
            }
        }
       },
       skip:skip,
       take: limit,
       orderBy:{createdAt:'desc'}

        });
        if(Post.length === 0){return res.status(404).json({msg:'Post Not Founded'})}
     
        res.status(200).json({Post, totalPage:Math.ceil(total/limit)})

    }catch(error){console.error(error); res.status(500).json({msg:'Server Error'})}
});

module.exports=router