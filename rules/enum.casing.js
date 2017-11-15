const { visit, getLocation } = require('graphql/language');
const { toUpper } = require('lodash');

const getMessage = (text, node) => {
  const message = `Property '${node.name
    .value}' has invalidly cased values. Please uppercase them.`;
  const location = getLocation({ body: text }, node.name.loc.start);

  return {
    message,
    line: location.line,
    column: location.column,
    ruleId: 'enum.casing',
    severity: 1
  };
};

module.exports = function(ast, text) {
  const messages = [];

  visit(ast, {
    EnumTypeDefinition(node) {
      let valid = true;

      visit(node, {
        EnumValueDefinition(node) {
          const uppercased = toUpper(node.name.value);
          if (uppercased !== node.name.value) {
            valid = false;
          }
        }
      });

      if (!valid) {
        const message = getMessage(text, node);
        if (message) {
          messages.push(message);
        }
      }
    }
  });

  return messages;
};
