var should = require('should');
var supertest = require("supertest");

var server = supertest.agent("http://localhost:3000");

describe('Main rest', function() {

    it("should return application information",function(done) {

        server
            .get("/")
            .expect("Content-type",/json/)
            .expect(200) // THis is HTTP response
            .end(function(err,res){
                res.status.should.equal(200);
                res.body.should.eql({
                    name: 'Race to International Business',
                    version: '1.0.0',
                    environ: "development"
                });
                done();
            });

    });
});

