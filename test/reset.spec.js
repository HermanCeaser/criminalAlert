const { expect } = require('chai');
const { verifyEmail } = require('../src/js/testReset.js');
const { verifyEmailExist } = require('../src/js/testReset.js');



describe('check verifyEmail  Reset  page', () => {

    it('handle null params', () => {
        const result = verifyEmail();
        expect(result).to.be.equal(false);
    })
    it('handle empty params', () => {
        const result = verifyEmail('');
        expect(result).to.be.equal(false);
    })

    it('handle correct response', () => {
        const result = verifyEmail('email@gmail.com');
        expect(result).to.be.equal(true);
    })




})

describe('check verifyEmailExist  Reset  page', () => {

    it('handle null params', () => {
        const result = verifyEmailExist();
        expect(result).to.be.equal(false);
    })
    it('handle empty params', () => {
        const result = verifyEmailExist('');
        expect(result).to.be.equal(false);
    })

    it('handle email already in use response', () => {
        const result = verifyEmailExist('email');
        expect(result).to.be.equal(false);
    })

    it('handle email already in use response', () => {
        const result = verifyEmailExist('email@gmail.com');
        expect(result).to.be.equal(true);
    })




})