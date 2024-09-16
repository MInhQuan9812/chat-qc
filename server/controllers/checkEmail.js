const UserModel = require("../models/UserModel")

async function checkEmail(request,respone){
    try{
        const {email} = request.body
        const checkEmail=await UserModel.findOne({email}).select("-password")

        if(!checkEmail){
            return respone.status(400).json({
                message:"User doen not exists",
                error:true
            })
        }

        return respone.status(200).json({
            message:"email verify",
            success:true,
            data:checkEmail
        })
    }catch(error){
        return respone.status(500)
    }
}
0
module.exports=checkEmail