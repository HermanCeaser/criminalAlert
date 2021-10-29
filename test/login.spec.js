const { expect } = require('chai');
const { verifyCorrectInputData } = require('../src/js/testLogin.js');
const { verifyUserEmailState } = require('../src/js/testLogin.js');


describe('check verifyCorrectInputData  Login  page', () => {

    it('handle null params for email', () => {
        const result = verifyCorrectInputData( null, 123);
        expect(result).to.be.equal(false);
    })
    it('handle null params for password', () => {
        const result = verifyCorrectInputData( "email@.com", null);
        expect(result).to.be.equal(false);
    })

    it('handle empty params for email', () => {
        const result = verifyCorrectInputData( '', 123);
        expect(result).to.be.equal(false);
    })
    it('handle empty params for password', () => {
        const result = verifyCorrectInputData( "email@.com", '');
        expect(result).to.be.equal(false);
    })


    it('handle correct respose', () => {
        const result = verifyCorrectInputData('email@gmail.com',123);
        expect(result).to.be.equal(true);
    })

})

describe('check verifyUserEmailState  Login  page', () => {
    it('handle null params for email state', () => {
        const result = verifyUserEmailState();
        expect(result).to.be.equal(false);
    })
    it('handle empty params for  email state', () => {
        const result = verifyUserEmailState('');
        expect(result).to.be.equal(false);
    })
    
    it('handle email not verify', () => {
        const result = verifyUserEmailState(false);
        expect(result).to.be.equal(false);
    })

    it('handle email  verify', () => {
        const result = verifyUserEmailState(true);
        expect(result).to.be.equal(true);
    })

})