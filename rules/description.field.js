const { visit, getLocation } = require('graphql/language');

const checkField = (text, node) => {
  const description = node.description;
  if (!description) {
    const message = `Field '${node.name.value}' does not have a description.`;
    const location = getLocation({ body: text }, node.name.loc.start);

    return {
      message,
      line: location.line,
      column: location.column,
      ruleId: 'description.field',
      severity: 1
    };
  }
};

module.exports = function(ast, text) {
  const messages = [];

  visit(ast, {
    FieldDefinition(node) {
      const message = checkField(text, node);
      if (message) {
        messages.push(message);
      }
    }
  });

  return messages;
};
