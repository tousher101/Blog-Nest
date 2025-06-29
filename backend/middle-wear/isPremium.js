const prisma = require('../utils/prisma');
const isPremium = async(req,res,next)=>{
    try{
    const User = await prisma.user.findUnique({
        where:{
            id:Number(req.user.id)
        }
    });
    if(!User || !User.isPremium){
        res.status(403).json({msg: 'Access not allowed! Need Premium Membership'})
    }
    next()
}catch(err){console.error(err); res.status(500).json({msg:'Server Error'})}
}

module.exports=isPremium