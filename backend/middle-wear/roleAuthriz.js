const roleAuthriz=(...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            res.status(403).json({msg:'Access not allowd'});
        }
        next();
    }
}

module.exports=roleAuthriz