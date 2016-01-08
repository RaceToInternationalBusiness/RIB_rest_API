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
var productURL;

var removeId = function(list) {
    list.forEach(function (item) {
        item._id = "oneId";
    })
};

describe('Product rest', function() {

    it('should create new product on my market', function(done) {
        server.post('/market').send({
            name: 'Champ'
        }).end(
               function(err, res) {
                   myMarketId = res.body._id;
                   server.post('/market/' + myMarketId + '/product')
                       .send(myProduct)
                       .expect('Content-type', /json/)
                       .expect(200, done)
                       .expect(function(res) {
                           res.body.should.have.property('_id');
                           myProductId = res.body._id;
                           myProduct['_id'] = myProductId;
                           myProduct['market'] = myMarketId;

                           productURL = '/market/' + myMarketId + '/product/' + myProductId;
                       }, done);
               });
    });

    it('should edit my product name on my market', function(done) {
        server.put(productURL)
            .send({
                name: 'Champagne'
            })
        .expect('Content-type', /json/)
            .expect(200, done)
            .expect(function(res) {
                myProduct.name = 'Champagne';

                removeId(myProduct.priceIndex);
                removeId(myProduct.advertising);

                res.body.should.have.property('priceIndex');
                removeId(res.body.priceIndex);
                res.body.should.have.property('advertising');
                removeId(res.body.advertising);
            })
        .expect(function(res) {
            res.body.should.have.property('_id').equal(myProductId);
            res.body.should.have.property('market').equal(myMarketId);
            res.body.should.have.property('name').equal(myProduct.name);
            res.body.should.have.property('priceIndex').eql(myProduct.priceIndex);
            res.body.should.have.property('advertising').eql(myProduct.advertising);
        }, done);
    });

    it('should add one priceIndex on my product', function(done) {
        var priceIndex = {index: 0.90, price: 14.50};
        server.put(productURL)
            .send({priceIndex: priceIndex})
            .expect('Content-type', /json/)
            .expect(200, done)
            .expect(function(res) {
                myProduct.priceIndex = myProduct.priceIndex.concat(priceIndex);

                removeId(myProduct.priceIndex);
                removeId(myProduct.advertising);

                res.body.should.have.property('priceIndex');
                removeId(res.body.priceIndex);
                res.body.should.have.property('advertising');
                removeId(res.body.advertising);
            })
            .expect(function(res) {
                res.body.should.have.property('_id').equal(myProductId);
                res.body.should.have.property('market').equal(myMarketId);
                res.body.should.have.property('name').equal(myProduct.name);
                res.body.should.have.property('priceIndex').eql(myProduct.priceIndex);
                res.body.should.have.property('advertising').eql(myProduct.advertising);
            }, done);
    });

    it('should add more priceIndex on my product', function(done) {
        var priceIndex = [
        {index: 0.83, price: 14.99},
        {index: 0.88, price: 15.20},
        {index: 0.77, price: 15.99}
        ];
        server.put(productURL)
            .send({priceIndex: priceIndex})
            .expect('Content-type', /json/)
            .expect(200, done)
            .expect(function(res) {
                myProduct.priceIndex = myProduct.priceIndex.concat(priceIndex);

                removeId(myProduct.priceIndex);
                removeId(myProduct.advertising);

                res.body.should.have.property('priceIndex');
                removeId(res.body.priceIndex);
                res.body.should.have.property('advertising');
                removeId(res.body.advertising);
            })
            .expect(function(res) {
                res.body.should.have.property('_id').equal(myProductId);
                res.body.should.have.property('market').equal(myMarketId);
                res.body.should.have.property('name').equal(myProduct.name);
                res.body.should.have.property('priceIndex').eql(myProduct.priceIndex);
                res.body.should.have.property('advertising').eql(myProduct.advertising);
            }, done);
    });

    it('should edit one priceIndex of my product', function(done) {
        var storedPriceIndex;
        server.get(productURL)
            .end(function(err, res) {
                storedPriceIndex = res.body.priceIndex[2];
                storedPriceIndex.price = 15.30;

                server.put(productURL)
                    .send({priceIndex: storedPriceIndex})
                    .expect(function() {
                        myProduct.priceIndex[2] = storedPriceIndex;
                    })
                    .expect('Content-type', /json/)
                    .expect(200, done)
                    .expect(function(res) {
                        removeId(myProduct.priceIndex);
                        removeId(myProduct.advertising);

                        res.body.should.have.property('priceIndex');
                        removeId(res.body.priceIndex);
                        res.body.should.have.property('advertising');
                        removeId(res.body.advertising);
                    })
                    .expect(function(res) {
                        res.body.should.have.property('_id').equal(myProductId);
                        res.body.should.have.property('market').equal(myMarketId);
                        res.body.should.have.property('name').equal(myProduct.name);
                        res.body.should.have.property('priceIndex').eql(myProduct.priceIndex);
                        res.body.should.have.property('advertising').eql(myProduct.advertising);
                    }, done);
            });
    });

    it('should edit more priceIndex of my product', function(done) {
        var storedPriceIndex;
        server.get(productURL)
            .end(function(err, res) {
                storedPriceIndex = res.body.priceIndex;
                storedPriceIndex[2].index = 0.85;
                storedPriceIndex[3].price = 15.60;

                server.put(productURL)
                    .send({priceIndex: storedPriceIndex})
                    .expect(function() {
                        myProduct.priceIndex = storedPriceIndex;
                    })
                    .expect('Content-type', /json/)
                    .expect(200, done)
                    .expect(function(res) {
                        removeId(myProduct.priceIndex);
                        removeId(myProduct.advertising);

                        res.body.should.have.property('priceIndex');
                        removeId(res.body.priceIndex);
                        res.body.should.have.property('advertising');
                        removeId(res.body.advertising);
                    })
                    .expect(function(res) {
                        res.body.should.have.property('_id').equal(myProductId);
                        res.body.should.have.property('market').equal(myMarketId);
                        res.body.should.have.property('name').equal(myProduct.name);
                        res.body.should.have.property('priceIndex').eql(myProduct.priceIndex);
                        res.body.should.have.property('advertising').eql(myProduct.advertising);
                    }, done);
            });
    });

    it('should edit and add priceIndex of my product', function(done) {
        var storedPriceIndex;
        server.get(productURL)
            .end(function(err, res) {
                storedPriceIndex = res.body.priceIndex;
                storedPriceIndex[2].index = 0.80;
                storedPriceIndex[3].price = 15.50;

                storedPriceIndex.push({index: 0.70, price: 15.75});
                storedPriceIndex.push({index: 0.65, price: 16.00});

                server.put(productURL)
                    .send({priceIndex: storedPriceIndex})
                    .expect(function() {
                        myProduct.priceIndex = storedPriceIndex;
                    })
                    .expect('Content-type', /json/)
                    .expect(200, done)
                    .expect(function(res) {
                        removeId(myProduct.priceIndex);
                        removeId(myProduct.advertising);

                        res.body.should.have.property('priceIndex');
                        removeId(res.body.priceIndex);
                        res.body.should.have.property('advertising');
                        removeId(res.body.advertising);
                    })
                    .expect(function(res) {
                        res.body.should.have.property('_id').equal(myProductId);
                        res.body.should.have.property('market').equal(myMarketId);
                        res.body.should.have.property('name').equal(myProduct.name);
                        res.body.should.have.property('priceIndex').eql(myProduct.priceIndex);
                        res.body.should.have.property('advertising').eql(myProduct.advertising);
                    }, done);
            });
    });

    it('should add one advertising on my product', function(done) {
        var advertising = {index: 0.00, sensibility: 0.00};
        server.put(productURL)
            .send({advertising: advertising})
            .expect('Content-type', /json/)
            .expect(200, done)
            .expect(function(res) {
                myProduct.advertising = myProduct.advertising.concat(advertising);

                removeId(myProduct.priceIndex);
                removeId(myProduct.advertising);

                res.body.should.have.property('priceIndex');
                removeId(res.body.priceIndex);
                res.body.should.have.property('advertising');
                removeId(res.body.advertising);
            })
            .expect(function(res) {
                res.body.should.have.property('_id').equal(myProductId);
                res.body.should.have.property('market').equal(myMarketId);
                res.body.should.have.property('name').equal(myProduct.name);
                res.body.should.have.property('priceIndex').eql(myProduct.priceIndex);
                res.body.should.have.property('advertising').eql(myProduct.advertising);
            }, done);
    });

    it('should add more advertising on my product', function(done) {
        var advertising = [
        {index: 0.33, sensibility: 1.0},
        {index: 0.70, sensibility:1.5},
        {index: 0.80, sensibility:2}
        ];
        server.put(productURL)
            .send({advertising: advertising})
            .expect('Content-type', /json/)
            .expect(200, done)
            .expect(function(res) {
                myProduct.advertising = myProduct.advertising.concat(advertising);

                removeId(myProduct.priceIndex);
                removeId(myProduct.advertising);

                res.body.should.have.property('priceIndex');
                removeId(res.body.priceIndex);
                res.body.should.have.property('advertising');
                removeId(res.body.advertising);
            })
            .expect(function(res) {
                res.body.should.have.property('_id').equal(myProductId);
                res.body.should.have.property('market').equal(myMarketId);
                res.body.should.have.property('name').equal(myProduct.name);
                res.body.should.have.property('priceIndex').eql(myProduct.priceIndex);
                res.body.should.have.property('advertising').eql(myProduct.advertising);
            }, done);
    });

    it('should edit one advertising of my product', function(done) {
        var storedData;
        server.get(productURL)
            .end(function(err, res) {
                storedData = res.body.advertising[2];
                storedData.index = 0.3;

                server.put(productURL)
                    .send({advertising: storedData})
                    .expect(function() {
                        myProduct.advertising[2] = storedData;
                    })
                    .expect('Content-type', /json/)
                    .expect(200, done)
                    .expect(function(res) {
                        removeId(myProduct.priceIndex);
                        removeId(myProduct.advertising);

                        res.body.should.have.property('priceIndex');
                        removeId(res.body.priceIndex);
                        res.body.should.have.property('advertising');
                        removeId(res.body.advertising);
                    })
                    .expect(function(res) {
                        res.body.should.have.property('_id').equal(myProductId);
                        res.body.should.have.property('market').equal(myMarketId);
                        res.body.should.have.property('name').equal(myProduct.name);
                        res.body.should.have.property('priceIndex').eql(myProduct.priceIndex);
                        res.body.should.have.property('advertising').eql(myProduct.advertising);
                    }, done);
            });
    });

    it('should edit more advertising of my product', function(done) {
        var storedData;
        server.get(productURL)
            .end(function(err, res) {
                storedData = res.body.advertising;
                storedData[2].sensibility = 20;
                storedData[3].index = 8.5;

                server.put(productURL)
                    .send({advertising: storedData})
                    .expect(function() {
                        myProduct.advertising = storedData;
                    })
                    .expect('Content-type', /json/)
                    .expect(200, done)
                    .expect(function(res) {
                        removeId(myProduct.priceIndex);
                        removeId(myProduct.advertising);

                        res.body.should.have.property('priceIndex');
                        removeId(res.body.priceIndex);
                        res.body.should.have.property('advertising');
                        removeId(res.body.advertising);
                    })
                    .expect(function(res) {
                        res.body.should.have.property('_id').equal(myProductId);
                        res.body.should.have.property('market').equal(myMarketId);
                        res.body.should.have.property('name').equal(myProduct.name);
                        res.body.should.have.property('priceIndex').eql(myProduct.priceIndex);
                        res.body.should.have.property('advertising').eql(myProduct.advertising);
                    }, done);
            });
    });

    it('should edit and add advertising of my product', function(done) {
        var storedData;
        server.get(productURL)
            .end(function(err, res) {
                storedData = res.body.advertising;
                storedData[2].sensibility = 2.0;
                storedData[3].index = 0.85;

                storedData.push({index: 0.93, sensibility: 4.0});
                storedData.push({index: 0.97, sensibility: 4.5});

                server.put(productURL)
                    .send({advertising: storedData})
                    .expect(function() {
                        myProduct.advertising = storedData;
                    })
                    .expect('Content-type', /json/)
                    .expect(200, done)
                    .expect(function(res) {
                        removeId(myProduct.priceIndex);
                        removeId(myProduct.advertising);

                        res.body.should.have.property('priceIndex');
                        removeId(res.body.priceIndex);
                        res.body.should.have.property('advertising');
                        removeId(res.body.advertising);
                    })
                    .expect(function(res) {
                        res.body.should.have.property('_id').equal(myProductId);
                        res.body.should.have.property('market').equal(myMarketId);
                        res.body.should.have.property('name').equal(myProduct.name);
                        res.body.should.have.property('priceIndex').eql(myProduct.priceIndex);
                        res.body.should.have.property('advertising').eql(myProduct.advertising);
                    }, done);
            });
    });

    it('should get one product', function(done) {
        server.get('/market/' + myMarketId + '/product/' + myProductId)
            .expect('Content-type', /json/)
            .expect(200, done)
            .expect(function(res) {
                removeId(myProduct.priceIndex);
                removeId(myProduct.advertising);

                res.body.should.have.property('priceIndex');
                removeId(res.body.priceIndex);
                res.body.should.have.property('advertising');
                removeId(res.body.advertising);
            })
            .expect(function(res) {
                res.body.should.have.property('_id').equal(myProductId);
                res.body.should.have.property('market').equal(myMarketId);
                res.body.should.have.property('name').equal(myProduct.name);
                res.body.should.have.property('priceIndex').eql(myProduct.priceIndex);
                res.body.should.have.property('advertising').eql(myProduct.advertising);
            }, done);
    });

    it('should get all product', function(done) {
        server.get('/market/' + myMarketId + '/products')
            .expect('Content-type', /json/)
            .expect(200, done)
            .expect(function(res) {
                res.body.should.be.an.Array;
                res.body.forEach(function(p) {
                    p.should.have.property('_id').not.be.empty;
                    p.should.have.property('name').be.a.String;
                    p.should.have.property('name').not.be.empty;
                });
            }, done);
    });
});

