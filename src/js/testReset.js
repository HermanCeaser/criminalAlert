

const  verifyEmail =  function(email){
    if (email == null || email == '') {
        return false
    }
    
    return true
}

const verifyEmailExist =  function(email){
    if (email == null || email == '') {
        return false
    }
    if(email == "email"){
        return false
    }
    return  true; 
}

module.exports = {
    verifyEmail, 
    verifyEmailExist,
}