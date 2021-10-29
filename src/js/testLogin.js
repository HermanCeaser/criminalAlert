

const verifyCorrectInputData = function (correo, password) {
    if (correo == null || password == null) {
        return false;
    }

    if (correo == "" || password == "") {
        return false;
    }

 

    return true;
}

const verifyUserEmailState = function (user) {
    if (user == null) return false;
    if (user == '') return false;
    if (user == false) return false;

    return true

}

 module.exports = {
    verifyCorrectInputData,
    verifyUserEmailState
}