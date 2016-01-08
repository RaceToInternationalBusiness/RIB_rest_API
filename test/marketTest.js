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

    ///////////////////////
    // Test Merchandiser //
    ///////////////////////
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
        var newMerchandiser =
            [
            {index:1.18, nbMerchandiser:4},
            {index:1.26, nbMerchandiser:5}
            ];
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
                storedMerchandiser.push({index:0.25, nbMerchandiser:6});
                storedMerchandiser.push({index:1.25, nbMerchandiser:7});

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

    ///////////////////////
    // Test PaymentDelay //
    ///////////////////////
    it("should add one PaymentDelay of myMarket", function(done) {
        var paymentDelay = {index:1.00, delay:"60j"};
        server.put("/market/" + myMarketId)
            .send({paymentDelay: paymentDelay})
            .expect(function() {
                myMarket.paymentDelay.push(paymentDelay);
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

    it("should add more PaymentDelay of myMarket", function(done) {
        var newPaymentDelay = [{index:1.18, delay:"60j fdm"},
        {index:1.26, delay:"90j"}];
        server.put("/market/" + myMarketId)
            .send({paymentDelay: newPaymentDelay})
            .expect(function() {
                myMarket.paymentDelay = myMarket.paymentDelay.concat(newPaymentDelay);
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

    it("should edit one PaymentDelay of myMarket", function(done) {
        var storedPaymentDelay;
        server.get("/market/" + myMarketId)
            .end(function (err, res) {
                storedPaymentDelay = res.body.paymentDelay[0];
                storedPaymentDelay.index = 0.95;

                server.put("/market/" + myMarketId)
                    .send({paymentDelay: storedPaymentDelay})
                    .expect(function () {
                        myMarket.paymentDelay[0] = storedPaymentDelay;
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

    it("should edit more PaymentDelay of myMarket", function(done) {
        var storedPaymentDelay;
        server.get("/market/" + myMarketId)
            .end(function (err, res) {
                storedPaymentDelay = res.body.paymentDelay;
                storedPaymentDelay[3].index = 2.5;
                storedPaymentDelay[2].delay = "Comptant";

                server.put("/market/" + myMarketId)
                    .send({paymentDelay: storedPaymentDelay})
                    .expect(function () {
                        myMarket.paymentDelay = storedPaymentDelay;
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

    it("should mixed edit and add more PaymentDelay of myMarket", function(done) {
        var storedPaymentDelay;
        server.get("/market/" + myMarketId)
            .end(function (err, res) {
                storedPaymentDelay = res.body.paymentDelay;
                storedPaymentDelay[0].index = 0.5;
                storedPaymentDelay[0].delay = "28j";
                storedPaymentDelay[3].delay = "35j";
                storedPaymentDelay.push({index:0.25, delay:"29j"});
                storedPaymentDelay.push({index:1.25, delay:"15j"});

                server.put("/market/" + myMarketId)
                    .send({paymentDelay: storedPaymentDelay})
                    .expect(function () {
                        myMarket.paymentDelay = storedPaymentDelay;
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

    it("should mixed edit myMarket", function(done) {
        var storedPaymentDelay;
        var storedMerchandiser;
        var newName = 'finalEdit market'
            server.get("/market/" + myMarketId)
            .end(function (err, res) {
                storedPaymentDelay = res.body.paymentDelay;
                storedPaymentDelay[0].index = 1.2;
                storedPaymentDelay[0].delay = "2j";
                storedPaymentDelay[3].delay = "3j";
                storedPaymentDelay.push({index:25, delay:"100j"});
                storedPaymentDelay.push({index:125, delay:"8j"});

                storedMerchandiser = res.body.merchandiser;
                storedMerchandiser[0].index = 42;
                storedMerchandiser[0].nbMerchandiser = 62;
                storedMerchandiser[3].nbMerchandiser = 33;
                storedMerchandiser.push({index:0.01, nbMerchandiser:1});
                storedMerchandiser.push({index:3, nbMerchandiser:9});

                server.put("/market/" + myMarketId)
                    .send({name: newName, paymentDelay: storedPaymentDelay, merchandiser: storedMerchandiser})
                    .expect(function () {
                        myMarket.name = newName;
                        myMarket.paymentDelay = storedPaymentDelay;
                        myMarket.merchandiser = storedMerchandiser;
                        removeId(myMarket.merchandiser);
                        removeId(myMarket.paymentDelay);
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

    it('should get all market', function(done) {
        server.get('/markets')
            .expect('Content-type', /json/)
            .expect(200, done)
            .expect(function(res) {
                res.body.should.be.an.Array;
                res.body.forEach(function(m) {
                    m.should.have.property('_id').not.be.empty;
                    m.should.have.property('name').be.a.String;
                    m.should.have.property('name').not.be.empty;
                });
            }, done);
    });
});

