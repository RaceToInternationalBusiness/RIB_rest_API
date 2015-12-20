var should = require('should');
var supertest = require("supertest");

var server = supertest.agent("http://localhost:3000");

var myMarket = {name:'myMarket',
    paymentDelay:[
        {index:0,delay:"0"},
        {index:0.95,delay:"30j"},
        {index:1.00,delay:"30j fdm"}
    ],
    merchandiser:[
        {index:0.30,nbMerchandiser:0},
        {index:0.60,nbMerchandiser:1},
        {index:0.8,nbMerchandiser:2}
    ]};
var myMarketId;

describe('Market rest', function() {

    it("should create new market", function(done) {
        server.post("/market")
            .send(myMarket)
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);

                res.status.should.equal(200);
                res.body.should.have.property('_id');
                myMarketId = res.body._id;
                done();
            })
    });

    it("should get myMaket by id", function(done) {
        server.get("/market/" + myMarketId)
            .expect("Content-type",/json/)
            .expect(200, done)
            .expect(function(res) {
                myMarket.paymentDelay.forEach(function (item) {
                    item._id = "oneId";
                });
                res.body.paymentDelay.forEach(function (item) {
                    item._id = "oneId";
                });

                myMarket.merchandiser.forEach(function (item) {
                    item._id = "oneId";
                });
                res.body.merchandiser.forEach(function (item) {
                    item._id = "oneId";
                });
            })
            .expect(function(res) {
                res.body.should.have.property('_id').equal(myMarketId);
                res.body.should.have.property('name').equal(myMarket.name);
                res.body.should.have.property('paymentDelay').eql(myMarket.paymentDelay);
                res.body.should.have.property('merchandiser').eql(myMarket.merchandiser);
            }, done);
    });
});