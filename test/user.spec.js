const { expect } = require('chai');
const { conRowSelected } = require('../src/js/testUser.js');
const { closeModal } = require('../src/js/testUser.js');
const { showModal } = require('../src/js/testUser.js');
const { editContent } = require('../src/js/testUser.js');

describe('check onRowSelected  User page', () => {

    it('handle null params', () => {
        const result = conRowSelected();
        expect(result).to.be.equal(false);
    })
    it('handle empty params', () => {
        const result = conRowSelected('');
        expect(result).to.be.equal(false);
    })
    it('handle correct params', () => {
        const result = conRowSelected(false);
        expect(result).to.be.equal(false);
    })

})

describe('check closeModal  User page', () => {

    it('handle null params', () => {
        const result = closeModal();
        expect(result).to.be.equal(true);
    })
    it('handle empty params', () => {
        const result = closeModal('');
        expect(result).to.be.equal(true);
    })
    it('handle correct params', () => {
        const result = closeModal(true);
        expect(result).to.be.equal(false);
    })

})

describe('check showModal  User page', () => {

    it('handle null params', () => {
        const result = showModal();
        expect(result).to.be.equal(true);
    })
    it('handle empty params', () => {
        const result = showModal('');
        expect(result).to.be.equal(true);
    })
    it('handle correct params', () => {
        const result = showModal(true);
        expect(result).to.be.equal(false);
    })

})

describe('check editContent  User page', () => {

    it('handle null params', () => {
        const result = editContent();
        expect(result).to.be.equal(true);
    })
    it('handle empty params', () => {
        const result = editContent('');
        expect(result).to.be.equal(true);
    })
    it('handle false params', () => {
        const result = editContent(false);
        expect(result).to.be.equal(true);
    })
    it('handle correct params', () => {
        const result = editContent(true);
        expect(result).to.be.equal(false);
    })

})

