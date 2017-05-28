'use strict';
const { parse } = require('graphql/language');
const { filter } = require('lodash');

module.exports = gqlint;

const rules = require('../rules');

function gqlint (text, fileName, options) {
    const ast = parse(text);
	let messages = [];

    // TODO: read rules from config file.
    for(const ruleName in rules) {
        const rule = rules[ruleName];
        const ruleMessages = rule(ast, text);
        messages = messages.concat(ruleMessages);
    }

    const errorCount = filter(messages, message => message.severity === 2).length;
    const warningCount = filter(messages, message => message.severity === 1).length;

	return [{
		filePath: fileName,
        errorCount,
        warningCount,
		messages,
	}];
}
