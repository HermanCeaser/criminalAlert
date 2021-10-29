


const validEmail = function (email) {

    if(email == null) return true;
    if(email == '')return  true;

    let re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    
    return re.test(email);
}

const emailAlreadyUseMsm = function (email) {
    if(email == null) return true;
    if(email == '')return  true;
    if(email.localeCompare('www.google.com') != 0)return true

    return 'Correo ingresado ya está en uso';
    
}

module.exports = {
    validEmail,
    emailAlreadyUseMsm,
}