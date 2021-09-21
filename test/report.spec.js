const assert = require("assert");
const { expect } = require('chai');
const { referenceVerification } = require('../src/js/testReport.js');
const { emptyInputSearchData } = require('../src/js/testReport.js');
const { countDownChanged } = require('../src/js/testReport.js');
const { countDownFormChanged } = require('../src/js/testReport.js');
const { validateEmptyInpputs } = require('../src/js/testReport.js');
const { stateDataResponse } = require('../src/js/testReport.js');


const axios = require('axios');


describe('verifided reference link  Report page', () => {

    it('should give a valid  http(s) link', () => {
        const result = referenceVerification("https://www.zetatijuana.com/tijuana/rosarito/Atacan-a-tiros-a-joven-en-colonia-Ampliacion-Plan-Libertador-de-Rosarito-20210910-0021.html");
        expect(result).to.be.equal(true);
    })

    it('should handle no parameters', () => {
        const result = referenceVerification();
        expect(result).to.be.equal(false);
    })

    it('should handle numeric numbers', () => {
        const result = referenceVerification(5);
        expect(result).to.be.equal(false);
    })

    it('should handle invalid sintax http(s) links', () => {
        const result = referenceVerification("test");
        expect(result).to.be.equal(false);
    })

    it('should handle invalid http(s) links', () => {
        const result = referenceVerification("https://www.google.com");
        expect(result).to.be.equal(false);
    })


})



describe('check function emptyInputSearchData Report page', () => {

    it(' handle no parameters', () => {
        const result = emptyInputSearchData();
        expect(result).to.be.equal(true);
    })

    it(' handle no numbers on #number and postal', () => {
        const result = emptyInputSearchData('camino', 'camino', 'a', 'a');
        expect(result).to.be.equal(true);
    })

    it(' handle negative values on #number and postal', () => {
        const result = emptyInputSearchData('camino', 'camino', -1, -1);
        expect(result).to.be.equal(true);
    })

    it(' handle long values on #number and postal', () => {
        const result = emptyInputSearchData('camino', 'camino', 123456789123, 12345678);
        expect(result).to.be.equal(true);
    })

    it(' handle decimal values on #number and postal', () => {
        const result = emptyInputSearchData('camino', 'camino', 1.123456789123, 1.12345678);
        expect(result).to.be.equal(true);
    })

})

describe('check function countDownChanged Report page', () => {

    it(' handle no parameters', () => {
        const result = countDownChanged();
        expect(result).to.be.equal('VALOR NULO');
    })

    it(' handle no string', () => {
        const result = countDownChanged('TEST');
        expect(result).to.be.equal('NO NUMERO');
    })

    it(' validate number', () => {
        const result = countDownChanged(5);
        expect(result).to.be.equal(5);
    })

})

describe('check function countDownFormChanged Report page', () => {

    it(' handle no parameters', () => {
        const result = countDownFormChanged();
        expect(result).to.be.equal(false);
    })

    it(' handle no string', () => {
        const result = countDownFormChanged('TEST');

        expect(result).to.be.equal(false);
    })

    it(' validate number', () => {
        const result = countDownFormChanged(5);
        expect(result).to.be.equal(5);
    })

})

describe('check function validateEmptyInpputs Report page', () => {

    it(' handle any empty parameters ', () => {
        const result = validateEmptyInpputs();
        expect(result).to.be.equal(false);

    })

    it(' handle incorrect numbers input ', () => {
        const result = validateEmptyInpputs(1, 1, 'numero', 'postal', 1, 'fecha', 'hora', 'referencia', 'selected', 'selectedType', 'selectedSex');
        expect(result).to.be.equal(false);

    })

    it(' handle incorrect numbers input ', () => {
        const result = validateEmptyInpputs('test', 'test', 'numero', 'postal', 'test', 'fecha', 'hora', 'referencia', 'selected', 'selectedType', 'selectedSex');
        expect(result).to.be.equal(false);

    })


})

describe('check function stateDataResponse Report page', () => {

    it(' handle problem with parse data ', () => {
        const result = stateDataResponse('No Results');
        expect(result).to.be.equal(false);
    })
    it(' handle problem with server response', () => {
        const result = stateDataResponse('123456789');
        expect(result).to.be.equal(false);
    })
    it(' handle only numbers response', () => {
        const result = stateDataResponse(123);
        expect(result).to.be.equal(false);
    })

})














