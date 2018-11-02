const { visit, getLocation } = require('graphql/language');

const checkObjectType = (text, node) => {
  const description = node.description;
  if (!description) {
    const message = `Type '${node.name.value}' does not have a description.`;
    const location = getLocation({ body: text }, node.name.loc.start);

    return {
      message,
      line: location.line,
      column: location.column,
      ruleId: 'description.type',
      severity: 1
    };
  }
};

module.exports = function(ast, text) {
  const messages = [];

  visit(ast, {
    ObjectTypeDefinition(node) {
      const message = checkObjectType(text, node);
      if (message) {
        messages.push(message);
      }
    }
  });

  return messages;
};
