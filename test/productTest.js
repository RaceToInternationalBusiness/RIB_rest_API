var should = require('should');
var supertest = require("supertest");

var server = supertest.agent("http://localhost:3000");

var myProduct = {
    "name": "Champagne",
    "priceIndex": [],
    "advertising": []
};
var myProductId;
var myMarketId;

describe('Product rest', function() {

    it('should create new product on my market', function(done) {
        server.post('/market').send({
            name: 'Champagne'
        }).end(
                function(err, res) {
                    myMarketId = res.body._id;
                    server.post('/market/' + myMarketId + '/product').send(
                            myProduct).expect('Content-type', /json/).expect(
                            200, done).expect(function(res) {
                        res.body.should.have.property('_id');
                        myProductId = res.body._id;
                        myProduct['_id'] = myProductId;
                        myProduct['__v'] = 0;
                        myProduct['market'] = myMarketId;
                    }, done);
                });
    });

    it('should get one product', function(done) {
        server.get('/market/' + myMarketId + '/product/' + myProductId).expect(
                'Content-type', /json/).expect(200, done)

        .expect(function(res) {
            res.body.should.eql(myProduct);
        }, done);
    });

    it('should get all product', function(done) {
        server.get('/market/' + myMarketId + '/products').expect(
                'Content-type', /json/).expect(200, done)

        .expect(function(res) {
            res.body.should.be.an.Array;
            res.body.should.eql([myProduct]);
        }, done);
    });
});
