const JWT_SECRET_KEY=process.env.SUPER_SECRET_LOGIN_KEY
const jwt=require('jsonwebtoken');

const verificatio=(req,res,next)=>{
   
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({msg: 'Access not allowd'})
    }
    const token = authHeader?.split(' ')[1];
    try{
        const decode = jwt.verify(token,JWT_SECRET_KEY)
        req.user=decode
        next();

    }catch(err){console.error(err); res.status(500).json({msg:'Server Error'})}
}

module.exports=verificatio