const { expect } = require('chai');
const { validEmail } = require('../src/js/testRegister.js');
const { emailAlreadyUseMsm } = require('../src/js/testRegister.js');

describe('check validEmail  Register page', () => {

    it('handle null params', () => {
        const result = validEmail();
        expect(result).to.be.equal(true);
    })
    it('handle empty params', () => {
        const result = validEmail('');
        expect(result).to.be.equal(true);
    })
    it('handle correct respose', () => {
        const result = validEmail('www.google.com');
        expect(result).to.be.equal(false);
    })



})


describe('check emailAlreadyUseMsm  Register page', () => {

    it('handle null params', () => {
        const result = emailAlreadyUseMsm();
        expect(result).to.be.equal(true);
    })
    it('handle empty params', () => {
        const result = emailAlreadyUseMsm('');
        expect(result).to.be.equal(true);
    })
    it('handle email not match respose', () => {
        const result = emailAlreadyUseMsm('www.le.com');
        expect(result).to.be.equal(true);
    })
    it('handle email  match respose', () => {
        const result = emailAlreadyUseMsm('www.google.com');
        expect(result).to.be.equal('Correo ingresado ya está en uso');
    })



})