"use strict";

module.exports = function (args) {
    return [].concat.apply([], args).filter(function (stream) {
        return Boolean(stream) && Boolean(stream.pipe);
    });
};
