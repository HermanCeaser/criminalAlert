const assert = require("assert");
const { expect } = require('chai');
const { checAddressString } = require('../src/js/testHome.js');
const { getTheMostAfectedPerson } = require('../src/js/testHome.js');
const { getSexReportStatus } = require('../src/js/testHome.js');
const { getHourReportStatus } = require('../src/js/testHome.js');
const { haversineDistance } = require('../src/js/testHome.js');

describe('check checAddressString  Home page', () => {

    it('handle inputs', () => {
        const result = checAddressString('camino ', 'andador', 1444, 2680);
        expect(result).to.be.equal(false);
    })

    it('handle empty inputs', () => {
        const result = checAddressString('', '',  123, 123);
        expect(result).to.be.equal(true);
    })

    it('handle inputs', () => {
        const result = checAddressString('camino ', 'andador', 1444, 2680);
        expect(result).to.be.equal(false);
    })

    it('handle null inputs', () => {
        const result = checAddressString();
        expect(result).to.be.equal(true);
    })

    it('handle not numeric number and zipcode  Home page', () => {
        const result = checAddressString('camino ', 'andador', 'a', '1');
        expect(result).to.be.equal(true);
    })

    it('handle negative numbers ', () => {
        const result = checAddressString('camino ', 'andador', -1, -500);
        expect(result).to.be.equal(true);
    })

    it('handle longs numbers ', () => {
        const result = checAddressString('camino ', 'andador', 12345678910, 1234567);
        expect(result).to.be.equal(true);
    })
    it('handle decimal numbers ', () => {
        const result = checAddressString('camino ', 'andador', 1.234, 1.23);
        expect(result).to.be.equal(true);
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
        expect(result).to.be.equal(false);
    })
    it('handle array  length 0', () => {
        const result = getSexReportStatus([]);
        expect(result).to.be.equal(false);
    }) 
    it('handle return array  ', () => {
        const result = getSexReportStatus(['hombre','hombre' ,'hombre', 'hombre']);
        expect(result).to.be.contains(4)
    }) 

})

describe('check function getHourReportStatus  Home page', () => {

    it('handle null inputs', () => {
        const result = getHourReportStatus();
        expect(result).to.be.equal(false);
    })
    it('handle array  length 0', () => {
        const result = getSexReportStatus([]);
        expect(result).to.be.equal(false);
    }) 
    it('handle return array  ', () => {
        const result = getSexReportStatus(['data','data' ,'data', 'data']);
        expect(result).to.be.contains(0)
    }) 

})

describe('check function haversineDistance  Home page', () => {

    it('handle null inputs', () => {
        const result = haversineDistance([],[1,2,3,4],[]);
        expect(result).to.be.equal(0);
    })

})












