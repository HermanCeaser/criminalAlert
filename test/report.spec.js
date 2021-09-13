const assert = require("assert");
const { expect } = require('chai');
const { referenceVerification } = require('../src/js/testReport.js');
const { emptyInputSearchData } = require('../src/js/testReport.js');


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
        const result = emptyInputSearchData('camino', 'camino', 1, 1);
        expect(result).to.be.equal(false);
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




