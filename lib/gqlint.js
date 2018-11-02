'use strict';
const { parse } = require('graphql/language');
const { filter } = require('lodash');

module.exports = gqlint;

const rules = require('../rules');

const setSeverityFromOptions = (options, messages) =>
  messages
    .map(message => {
      const rule = options.rules[message.ruleId];

      if (rule === 'error' || rule === 2) {
        return Object.assign({}, message, {
          severity: 2
        });
      } else if (rule === 'warn' || rule === 1) {
        return Object.assign({}, message, {
          severity: 1
        });
      } else if (rule === 'off' || rule === 0) {
        return false;
      } else if (!rule) {
        return false;
      }
    })
    .filter(message => message);

function gqlint(text, fileName, options) {
  const ast = parse(text);
  let messages = [];

  for (const ruleName in rules) {
    const rule = rules[ruleName];
    let ruleMessages = rule(ast, text);
    if (options.rules) {
      ruleMessages = setSeverityFromOptions(options, ruleMessages);
    }
    messages = messages.concat(ruleMessages);
  }

  const errorCount = filter(messages, message => message.severity === 2).length;
  const warningCount = filter(messages, message => message.severity === 1)
    .length;

  return [
    {
      filePath: fileName,
      errorCount,
      warningCount,
      messages,
      source: text
    }
  ];
}
