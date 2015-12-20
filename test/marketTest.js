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

var removeId = function(list) {
    list.forEach(function (item) {
        item._id = "oneId";
    })
};

describe('Market rest', function() {

    it("should create new market", function(done) {
        server.post("/market")
            .send(myMarket)
            .expect("Content-type", /json/)
            .expect(200, done)
            .expect(function (res) {
                res.body.should.have.property('_id');
                myMarketId = res.body._id;
            }, done);
    });

    it("should get myMaket by id", function(done) {
        server.get("/market/" + myMarketId)
            .expect(function() {
                removeId(myMarket.merchandiser);
                removeId(myMarket.paymentDelay);
            })
            .expect("Content-type",/json/)
            .expect(200, done)
            .expect(function(res) {
                res.body.should.have.property('paymentDelay');
                removeId(res.body.paymentDelay);
                res.body.should.have.property('merchandiser');
                removeId(res.body.merchandiser);
            })
            .expect(function(res) {
                res.body.should.have.property('_id').equal(myMarketId);
                res.body.should.have.property('name').equal(myMarket.name);
                res.body.should.have.property('paymentDelay').eql(myMarket.paymentDelay);
                res.body.should.have.property('merchandiser').eql(myMarket.merchandiser);
            }, done);
    });

    it("should edit name of myMarket", function(done) {
        server.put("/market/" + myMarketId)
            .send({name: "editedMarket"})
            .expect(function() {
                removeId(myMarket.merchandiser);
                removeId(myMarket.paymentDelay);
            })
            .expect(function() {
                myMarket.name = "editedMarket";
            })
            .expect("Content-type",/json/)
            .expect(200, done)
            .expect(function(res) {
                res.body.should.have.property('paymentDelay');
                removeId(res.body.paymentDelay);
                res.body.should.have.property('merchandiser');
                removeId(res.body.merchandiser);
            })
            .expect(function(res) {
                res.body.should.have.property('_id').equal(myMarketId);
                res.body.should.have.property('name').equal(myMarket.name);
                res.body.should.have.property('paymentDelay').eql(myMarket.paymentDelay);
                res.body.should.have.property('merchandiser').eql(myMarket.merchandiser);
            }, done);
    });

    it("should add one merchandiser of myMarket", function(done) {
        var newMerchandiser = {index:1.00, nbMerchandiser:3};
        server.put("/market/" + myMarketId)
            .send({merchandiser: newMerchandiser})
            .expect(function() {
                myMarket.merchandiser.push(newMerchandiser);
                removeId(myMarket.merchandiser);
                removeId(myMarket.paymentDelay);
            })
            .expect(function() {
                myMarket.name = "editedMarket";
            })
            .expect("Content-type",/json/)
            .expect(200, done)
            .expect(function(res) {
                res.body.should.have.property('paymentDelay');
                removeId(res.body.paymentDelay);
                res.body.should.have.property('merchandiser');
                removeId(res.body.merchandiser);
            })
            .expect(function(res) {
                res.body.should.have.property('_id').equal(myMarketId);
                res.body.should.have.property('name').equal(myMarket.name);
                res.body.should.have.property('paymentDelay').eql(myMarket.paymentDelay);
                res.body.should.have.property('merchandiser').eql(myMarket.merchandiser);
            }, done);
    });

    it("should add more merchandiser of myMarket", function(done) {
        var newMerchandiser = [{index:1.18, nbMerchandiser:4},
            {index:1.26, nbMerchandiser:5}];
        server.put("/market/" + myMarketId)
            .send({merchandiser: newMerchandiser})
            .expect(function() {
                myMarket.merchandiser = myMarket.merchandiser.concat(newMerchandiser);
                removeId(myMarket.merchandiser);
                removeId(myMarket.paymentDelay);
            })
            .expect(function() {
                myMarket.name = "editedMarket";
            })
            .expect("Content-type",/json/)
            .expect(200, done)
            .expect(function(res) {
                res.body.should.have.property('paymentDelay');
                removeId(res.body.paymentDelay);
                res.body.should.have.property('merchandiser');
                removeId(res.body.merchandiser);
            })
            .expect(function(res) {
                res.body.should.have.property('_id').equal(myMarketId);
                res.body.should.have.property('name').equal(myMarket.name);
                res.body.should.have.property('paymentDelay').eql(myMarket.paymentDelay);
                res.body.should.have.property('merchandiser').eql(myMarket.merchandiser);
            }, done);
    });

    it("should edit one merchandiser of myMarket", function(done) {
        var storedMerchandiser;
        server.get("/market/" + myMarketId)
            .end(function (err, res) {
                storedMerchandiser = res.body.merchandiser[0];
                storedMerchandiser.index = 5;

                server.put("/market/" + myMarketId)
                    .send({merchandiser: storedMerchandiser})
                    .expect(function () {
                        myMarket.merchandiser[0] = storedMerchandiser;
                        removeId(myMarket.merchandiser);
                        removeId(myMarket.paymentDelay);
                    })
                    .expect(function () {
                        myMarket.name = "editedMarket";
                    })
                    .expect("Content-type", /json/)
                    .expect(200, done)
                    .expect(function (res) {
                        res.body.should.have.property('paymentDelay');
                        removeId(res.body.paymentDelay);
                        res.body.should.have.property('merchandiser');
                        removeId(res.body.merchandiser);
                    })
                    .expect(function (res) {
                        res.body.should.have.property('_id').equal(myMarketId);
                        res.body.should.have.property('name').equal(myMarket.name);
                        res.body.should.have.property('paymentDelay').eql(myMarket.paymentDelay);
                        res.body.should.have.property('merchandiser').eql(myMarket.merchandiser);
                    }, done);
            });
    });

    it("should edit more merchandiser of myMarket", function(done) {
        var storedMerchandiser;
        server.get("/market/" + myMarketId)
            .end(function (err, res) {
                storedMerchandiser = res.body.merchandiser;
                storedMerchandiser[3].index = 2.5;
                storedMerchandiser[2].nbMerchandiser = 8;

                server.put("/market/" + myMarketId)
                    .send({merchandiser: storedMerchandiser})
                    .expect(function () {
                        myMarket.merchandiser = storedMerchandiser;
                        removeId(myMarket.merchandiser);
                        removeId(myMarket.paymentDelay);
                    })
                    .expect(function () {
                        myMarket.name = "editedMarket";
                    })
                    .expect("Content-type", /json/)
                    .expect(200, done)
                    .expect(function (res) {
                        res.body.should.have.property('paymentDelay');
                        removeId(res.body.paymentDelay);
                        res.body.should.have.property('merchandiser');
                        removeId(res.body.merchandiser);
                    })
                    .expect(function (res) {
                        res.body.should.have.property('_id').equal(myMarketId);
                        res.body.should.have.property('name').equal(myMarket.name);
                        res.body.should.have.property('paymentDelay').eql(myMarket.paymentDelay);
                        res.body.should.have.property('merchandiser').eql(myMarket.merchandiser);
                    }, done);
            });
    });

    it("should mixed edit and add more merchandiser of myMarket", function(done) {
        var storedMerchandiser;
        server.get("/market/" + myMarketId)
            .end(function (err, res) {
                storedMerchandiser = res.body.merchandiser;
                storedMerchandiser[0].index = 2.5;
                storedMerchandiser[0].nbMerchandiser = 8;
                storedMerchandiser[3].nbMerchandiser = 42;
                storedMerchandiser.push({index:0.25, nbMerchandiser:6})
                storedMerchandiser.push({index:1.25, nbMerchandiser:7})

                server.put("/market/" + myMarketId)
                    .send({merchandiser: storedMerchandiser})
                    .expect(function () {
                        myMarket.merchandiser = storedMerchandiser;
                        removeId(myMarket.merchandiser);
                        removeId(myMarket.paymentDelay);
                    })
                    .expect(function () {
                        myMarket.name = "editedMarket";
                    })
                    .expect("Content-type", /json/)
                    .expect(200, done)
                    .expect(function (res) {
                        res.body.should.have.property('paymentDelay');
                        removeId(res.body.paymentDelay);
                        res.body.should.have.property('merchandiser');
                        removeId(res.body.merchandiser);
                    })
                    .expect(function (res) {
                        res.body.should.have.property('_id').equal(myMarketId);
                        res.body.should.have.property('name').equal(myMarket.name);
                        res.body.should.have.property('paymentDelay').eql(myMarket.paymentDelay);
                        res.body.should.have.property('merchandiser').eql(myMarket.merchandiser);
                    }, done);
            });
    });
});