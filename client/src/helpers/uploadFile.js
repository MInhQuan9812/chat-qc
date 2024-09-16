const url= `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUDNAME}/auto/upload`

const uploadFile= async(file) =>{
    const formData=new FormData()
    formData.append('file',file)
    formData.append("upload_preset","chat-app-file")

    const response=fetch(url,{
        method:'post',
        body:formData,
    })

    const responseData=(await response).json()

    return responseData
}

module.exports=uploadFile