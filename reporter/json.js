/**
 * @fileoverview JSON reporter
 * @author Burak Yigit Kaya aka BYK
 * @link https://github.com/eslint/eslint/blob/master/lib/formatters/json.js
 */
"use strict";

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function(results) {
    return JSON.stringify(results);
};
