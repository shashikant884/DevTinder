const adminAuth = (req ,res , next)=>{
    const token = "xyz";
    const isAdminAuthorired = token ==="xyzz";
    if(!isAdminAuthorired){
        res.status(401).send("Unauthorized request")
    }else{
        next();
    }
}

const userAuth = (req ,res , next)=>{
    const token = "xyz";
    const isAdminAuthorired = token ==="xyz";
    if(!isAdminAuthorired){
        res.status(401).send("Unauthorized request")
    }else{
        next();
    }
}

module.exports ={
    adminAuth,
    userAuth,
}