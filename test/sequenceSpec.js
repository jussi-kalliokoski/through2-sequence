"use strict";

var sequence = require("../index.js");
var through = require("through2");

describe("sequence", function () {
    it("should create a stream where the first stream is the input and the last the output", function (callback) {
        var result;

        var stream = sequence([through(function (chunk, encoding, callback) {
            this.push(chunk.toString() + "bar");
            callback();
        }), through(function (chunk, encoding, callback) {
            this.push(chunk.toString() + "baz");
            callback();
        }), through(function (chunk, encoding, callback) {
            this.push(chunk.toString() + "coo");
            callback();
        })]);

        stream.on("data", function (data) {
            result = data;
        });

        stream.on("end", function () {
            result.toString().should.equal("foobarbazcoo");
            callback();
        });

        var input = through();
        input.pipe(stream);
        input.write("foo");
        setImmediate(function () {
            input.emit("end");
        });
    });

    it("should accept streams in arrays or as rest arguments and ignore non-streams", function (callback) {
        var result;

        var stream = sequence(through(function (chunk, encoding, callback) {
            this.push(chunk.toString() + "bar");
            callback();
        }), [null, through(function (chunk, encoding, callback) {
            this.push(chunk.toString() + "baz");
            callback();
        })], through(function (chunk, encoding, callback) {
            this.push(chunk.toString() + "coo");
            callback();
        }));

        stream.on("data", function (data) {
            result = data;
        });

        stream.on("end", function () {
            result.toString().should.equal("foobarbazcoo");
            callback();
        });

        var input = through();
        input.pipe(stream);
        input.write("foo");
        setImmediate(function () {
            input.emit("end");
        });
    });
});

describe("sequence.obj", function () {
    it("should create a stream where the first stream is the input and the last the output", function (callback) {
        var result;

        var stream = sequence.obj([through.obj(function (chunk, encoding, callback) {
            chunk.a = 1;
            this.push(chunk);
            callback();
        }), through.obj(function (chunk, encoding, callback) {
            chunk.b = 2;
            this.push(chunk);
            callback();
        }), through.obj(function (chunk, encoding, callback) {
            chunk.c = 3;
            this.push(chunk);
            callback();
        })]);

        stream.on("data", function (data) {
            result = data;
        });

        stream.on("end", function () {
            result.a.should.equal(1);
            result.b.should.equal(2);
            result.c.should.equal(3);
            callback();
        });

        var input = through.obj();
        input.pipe(stream);
        input.write({});
        setImmediate(function () {
            input.emit("end");
        });
    });

    it("should accept streams in arrays or as rest arguments and ingnore non-streams", function (callback) {
        var result;

        var stream = sequence.obj(through.obj(function (chunk, encoding, callback) {
            chunk.a = 1;
            this.push(chunk);
            callback();
        }), [null, through.obj(function (chunk, encoding, callback) {
            chunk.b = 2;
            this.push(chunk);
            callback();
        })], through.obj(function (chunk, encoding, callback) {
            chunk.c = 3;
            this.push(chunk);
            callback();
        }));

        stream.on("data", function (data) {
            result = data;
        });

        stream.on("end", function () {
            result.a.should.equal(1);
            result.b.should.equal(2);
            result.c.should.equal(3);
            callback();
        });

        var input = through.obj();
        input.pipe(stream);
        input.write({});
        setImmediate(function () {
            input.emit("end");
        });
    });
});
