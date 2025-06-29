const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');
const verificatio=require('../middle-wear/verification');
const roleAuthriz = require('../middle-wear/roleAuthriz');

//post Comment for all
router.post('/commentpost/:id', verificatio, async(req,res)=>{
    try{
        const {comment}= req.body
        if(!comment){return res.status(400).json({msg: 'Comment cannot be empty'})}
const User = await prisma.user.findUnique({
    where:{id: Number(req.user.id)}
});
if(!User){return res.status(404).json({msg:'User Not Found'})};

const Post = await prisma.post.findUnique({
    where:{id:Number(req.params.id)}
});
if(!Post){return res.status(404).json({msg:'Post Not Found'})};

    await prisma.comment.create({
    data:{comment, userId: User.id, postId: Post.id}
})
res.status(200).json({msg:'Comement Added'})

}catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});


//Get All Comment:
router.get('/getcomment/:postId', verificatio,async(req,res)=>{
    try{
        const page= Number(req.query.page)|| 1;
        const limit= Number(req.query.limit) || 10;
        const skip = (page-1)*limit
        const totalComment = await prisma.comment.count({
            where:{postId: Number(req.params.postId)}
        });
        const comment = await prisma.comment.findMany({
            where:{postId:Number(req.params.postId)},
            select:{
                comment: true,
                createdAt: true,
                id: true,
                user:{
                    select:{
                        name: true,
                        role: true,
                        photos: true,
                        id: true
                    }
                }
            },
            skip:skip,
            take: limit,
            orderBy:{
        createdAt: 'desc'
            }
            
        });
        res.status(200).json({comment, totalComment, totalPage:Math.ceil(totalComment/limit)})


    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});


//Count Comment:
router.get('/countcomment/:postId', verificatio,async(req,res)=>{
    try{
      const commentCount = await prisma.comment.count({
            where:{postId:Number(req.params.postId)}
        })
        res.status(200).json(commentCount)
    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//Like post
router.put('/likepost/:id', verificatio,async(req,res)=>{
    try{
        const Post = await prisma.post.findUnique({
            where:{id: Number(req.params.id)}
        });
        if(!Post){return res.status(404).json({msg:'Post Not Found'})}

        await prisma.post.update({
            where:{id:Post.id},
            data:{likeCount:{increment:1}}
        });
        res.status(200).json({msg:'Liked'})

    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//get like count
router.get('/getlike-dislike/:id', verificatio,async(req,res)=>{
    try{
        
      const countLike=  await prisma.post.findUnique({
            where:{id:Number(req.params.id)},
            select:{likeCount:true}
        });

        const countDislike = await prisma.post.findUnique({
            where:{id:Number(req.params.id)},
            select:{dislikeCount: true}
        });

        res.status(200).json({countLike, countDislike});

    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});

//Dislike Post
router.put('/dislikepost/:id', verificatio,async(req,res)=>{
    try{
        const Post = await prisma.post.findUnique({
            where:{id: Number(req.params.id)}
        });
        if(!Post){return res.status(404).json({msg:'Post Not Found'})}

        await prisma.post.update({
            where:{id:Post.id},
            data:{dislikeCount:{increment:1}}
        });
        res.status(200).json({msg:'Disliked'})

    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});






// Delete Comment Admin Only
router.delete('/deletecomment/:id', verificatio,roleAuthriz('ADMIN'),async(req,res)=>{
    try{
     
        const Comment = await prisma.comment.findUnique({
            where:{id:Number(req.params.id)}
        });
        if(!Comment){ return res.status(404).json({msg:'Comment Not Found'})}
        await prisma.comment.delete({
            where:{id:Comment.id}
        });
        res.status(200).json({msg:'Comment Deleted'})

    }catch(err){console.error(err); res.status(500).json({msg: 'Server Error'})}
});


//Create Follow System:
router.post('/follow/:targetUserId',verificatio,async(req,res)=>{
    
    const followerId=Number(req.user.id)
    const followingId=Number(req.params.targetUserId)
   
    try{
        if(followerId === followingId){return res.status(400).json({msg:'Self Follow Not Allowed'})}
        const dupFollower = await prisma.follow.findUnique({
            where:{followerId_followingId:{ followerId, followingId}}
        });
        if(dupFollower){return res.status(400).json({msg:'Already Following'})}
        await prisma.follow.create({
           data:{followerId, followingId}
        });
        res.status(200).json({msg:'Following'})
    }catch(err){console.error(err); res.status(500).json({msg:'Server Error'})}
});


//Unfollow System
router.delete('/unfollow/:targetuserId',verificatio,async(req,res)=>{
    const followerId=Number(req.user.id)
    const followingId=Number(req.params.targetuserId)
    try{
        if(followerId === followingId){return res.status(400).json({msg:'Self Unfollow Not Allowed'})}
   
       const unfollow= await prisma.follow.delete({
           where:{followerId_followingId:{followingId, followerId}}
        });
        if(!unfollow){res.status(400).json({msg:'You are  not following this user'})}
        res.status(200).json({msg:'Unfollowing'})
    }catch(err){console.error(err); res.status(500).json({msg:'Server Error'})}
});

//get all follower
router.get('/getfollower', verificatio, async(req,res)=>{
    try{
        const User = await prisma.user.findUnique({
        where:{id:Number(req.user.id)}
    });
    if(!User){res.status(404).json({msg:'User Not Found'})}

        const page = Number(req.query.page) || 1;
        const limit= Number(req.query.limit) || 15;
        const skip = (page-1)*limit
        const total = await prisma.follow.count({
            where:{followingId:User.id,}
        });



    const getfollower = await prisma.follow.findMany({
        where:{followingId:User.id },
            select:{
                follower:{
                    select:{
                        id: true,
                        name:true,
                        role: true,
                        photos: true,
                    }
                }
            },
        skip: skip,
        take: limit,
        orderBy:{createdAt:'desc'}
    });
     res.status(200).json({getfollower, totalPage:Math.ceil(total/limit), total})
    }catch(err){console.error(err); res.status(500).json({msg:'Server Error'})}
});

//Get All Following
router.get('/getfollowing', verificatio, async(req,res)=>{
    try{
          const User = await prisma.user.findUnique({
        where:{id:Number(req.user.id)}
    });
    if(!User){res.status(404).json({msg:'User Not Found'})}
    
        const page = Number(req.query.page) || 1;
        const limit= Number(req.query.limit) || 15;
        const skip = (page-1)*limit
        const total = await prisma.follow.count({
            where:{followerId:User.id}
        })
  

    const getfollowing = await prisma.follow.findMany({
        where:{followerId:User.id, },
        select:{
            following:{
                select:{
                    id: true,
                    name:true,
                    role: true,
                    photos: true,
                }
            }
        },
        skip: skip,
        take: limit,
        orderBy:{createdAt:'desc'}
    });
    res.status(200).json({getfollowing, totalPage:Math.ceil(total/limit), total})
    }catch(err){console.error(err); res.status(500).json({msg:'Server Error'})}
});




module.exports=router
