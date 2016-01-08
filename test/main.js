var should = require('should');
var supertest = require("supertest");

var server = supertest.agent("http://localhost:3000");

describe('Main rest', function() {

    it("should return application information",function(done) {
        server
            .get("/")
            .expect("Content-type",/json/)
            .expect(200, {
                name: 'Race to International Business',
                version: '1.0.0',
                environ: "development"
            }, done)

    });
});

