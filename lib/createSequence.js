"use strict";

var prepareStreamsList = require("./prepareStreamsList");

module.exports = function (through) {
    return function () {
        var streams = prepareStreamsList(arguments);

        if(!streams.length) streams = [through()];

        var first = streams[0];

        var input = through(function (chunk, encoding, callback) {
            first.write(chunk, encoding);
            callback();
        }, first.emit.bind(first, "end"));

        var output = streams.reduce(function (previous, current) {
            return previous.pipe(current)
        });

        output.on("data", input.push.bind(input));
        output.on("end", input.emit.bind(input, "end"));
        output.on("error", input.emit.bind(input, "error"));

        return input;
    };
};
