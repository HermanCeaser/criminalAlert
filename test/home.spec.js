const assert = require("assert");
const { expect } = require('chai');
const { checAddressString } = require('../src/js/testHome.js');
const { getTheMostAfectedPerson } = require('../src/js/testHome.js');
const { getSexReportStatus } = require('../src/js/testHome.js');
const { getHourReportStatus } = require('../src/js/testHome.js');
const { haversineDistance } = require('../src/js/testHome.js');

describe('check address input string  Home page', () => {

    it('handle null inputs', () => {
        const result = checAddressString();
        expect(result).to.be.equal(0);
    })

    it('handle not numeric number and zipcode  Home page', () => {
        const result = checAddressString('camino ', 'andador', 'a', '1');
        expect(result).to.be.equal(2);
    })

    it('handle negative numbers ', () => {
        const result = checAddressString('camino ', 'andador', -1, -500);
        expect(result).to.be.equal(3);
    })

})

describe('check function getTheMostAfectedGender  Home page', () => {

    it('handle null inputs', () => {
        const result = getTheMostAfectedPerson();
        expect(result).to.be.equal(false);
    })
    it('reponse  gender hombres', () => {
        const result = getTheMostAfectedPerson([5, 1, 1], 5, 1);
        expect(result).to.be.equal("hombres");
    })
    it('reponse  gender  mujer', () => {
        const result = getTheMostAfectedPerson([1, 2, 1], 1, 2);
        expect(result).to.be.equal("Mujeres");
    })
    it('reponse  gender  LGBT+', () => {
        const result = getTheMostAfectedPerson([1, 1, 3], 1, 1);
        expect(result).to.be.equal("LGBT+");
    })

})

describe('check function getSexReportStatus  Home page', () => {

    it('handle null inputs', () => {
        const result = getSexReportStatus();
        expect(result).to.be.equal(0);
    })

})

describe('check function getHourReportStatus  Home page', () => {

    it('handle null inputs', () => {
        const result = getHourReportStatus();
        expect(result).to.be.equal(0);
    })

})

describe('check function haversineDistance  Home page', () => {

    it('handle null inputs', () => {
        const result = haversineDistance([],[1,2,3,4],[]);
        expect(result).to.be.equal(0);
    })

})












