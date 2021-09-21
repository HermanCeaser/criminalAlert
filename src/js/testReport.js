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

const countDownChanged = function (dismissCountDown) {

    if (dismissCountDown == undefined || dismissCountDown == '') {
        return 'VALOR NULO'
    }

    if (isNaN(dismissCountDown)) {
        return 'NO NUMERO'
    }

    return dismissCountDown;
}

const countDownFormChanged = function (valor) {

    if (valor == undefined || valor == '') {
        return false;
    }

    if (isNaN(valor)) {
        return false
    }
    return valor;
}

const validateEmptyInpputs = function (colonia, calle, numero, postal, descripcion, fecha, hora, referencia, selected, selectedType, selectedSex) {
    if (
        !colonia ||
        !calle ||
        !numero ||
        !postal ||
        !descripcion ||
        !fecha ||
        !hora ||
        !referencia ||
        !selected ||
        !selectedType ||
        !selectedSex
    ) {
        return false;
    }

    if (Number.isNaN(colonia) || Number.isNaN(calle) || Number.isNaN(descripcion)) {
        return false;
    }

    if (!Number.isNaN(numero) || !Number.isNaN(postal)) {
        return false;
    }

    return true;
}

const stateDataResponse = function(data){
    if(data == 'No Results'){
        return false;
    }
    if(data.length < 20){
        return false;
    }
    if(!isNaN(data)){
        return false;
    }
    return true;
}

module.exports = {
    referenceVerification,
    emptyInputSearchData,
    countDownChanged,
    countDownFormChanged,
    validateEmptyInpputs,
    stateDataResponse

}
