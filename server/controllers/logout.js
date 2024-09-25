

 async function logout(request,response){
    try{
        const accessToken=request.cookie.token
        // const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken }); // Check if that token is blacklisted
        // if(!checkIfBlacklisted){
        //     const newBlacklist = new Blacklist({
        //         token: accessToken,
        //       });
        //       await newBlacklist.save()
        // }
        
        const cookieOptions={
            http:true,
            secure:true,
            expires: new Date(0) 
        }
        return response.cookie('token','',cookieOptions).status(200).json({
            message:"session out",
            success:true
        })
    }catch(error){
        return response.status(500).json({
            message: error.message || error,
            error:true
        })
    }
}

module.exports=logout