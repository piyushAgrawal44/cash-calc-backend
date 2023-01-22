import jwt from 'jsonwebtoken';
let privateKey = "piyu@sh@#@^&^1310";

export const decode_user=(req,res,next)=>{

    let token=req.header('user-auth-token');
    if (!token) {
        return res.status(401).json({success:false, message:"Access Denied !"});
    }
   try {
    let data=jwt.verify(token,privateKey);
    req.user=data.user;
    next();
   } catch (error) {
    return res.status(401).json({success:false, message:"Wrong Auth Token"});
   }
    
}