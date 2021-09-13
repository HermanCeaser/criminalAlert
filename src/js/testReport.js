const referenceVerification = function (referencia) {

    if (referencia == undefined || referencia == '') {
        return false;
    }

    if (!isNaN(referencia)) {
        return false;
    }

    let result = referencia.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );
    if (result == null) {
        return false;
    }

    if ((result.toString().toLowerCase().includes('zetatijuana') ||
        result.toString().toLowerCase().includes('elsoldetijuana') ||
        result.toString().toLowerCase().includes('tijuanainformativo') ||
        result.toString().toLowerCase().includes('elimparcial') ||
        result.toString().toLowerCase().includes('alfredoalvarez') ||
        result.toString().toLowerCase().includes('afntijuana') ||
        result.toString().toLowerCase().includes('milenio')) == false) {
        return false;
    }

    return true;


}


const emptyInputSearchData = function (colonia, calle, numero, postal) {
    if (!colonia || !calle || !numero || !postal) {
        this.dismissCountDown = this.dismissSecs;
        return true;
    }
    if (isNaN(numero) || isNaN(postal)) {
        this.dismissCountDown = this.dismissSecs;
        return true;
    }
    if (numero < 0 || postal < 0) {
        this.dismissCountDown = this.dismissSecs;
        return true;
    }

    if (numero.toString().length > 10 || postal.toString().length > 6) {
        this.dismissCountDown = this.dismissSecs;
        return true;
    }
    if ((numero % 1) != 0 || (postal % 1) != 0) {
        this.dismissCountDown = this.dismissSecs;
        return true;
    }

    return false;
}

module.exports = {
    referenceVerification,
    emptyInputSearchData,
}
