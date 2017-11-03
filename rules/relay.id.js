const { visit, getLocation } = require('graphql/language');

// Check if type has a valid id type.
const checkType = (text, fieldName, node) => {
  if (node.name.value !== 'ID' && fieldName !== 'clientMutationId') {
    const message = `Field '${fieldName}' uses ${node.name
      .value}. Please use 'ID' instead.`;
    const location = getLocation({ body: text }, node.name.loc.start);

    return {
      message,
      line: location.line,
      column: location.column,
      ruleId: 'relay.id',
      severity: 1
    };
  }
};

// Split camelcase and turn into array.
const splitFieldName = fieldName =>
  fieldName
    .replace(/([a-z](?=[A-Z]))/g, '$1 ')
    .split(' ')
    .map(value => value.toLowerCase());

// Walk through this field until you find the NamedType, and check if that type is valid.
const checkNamedType = (node, text, messages) => {
  const fieldName = node.name.value;
  const fieldNameSplit = splitFieldName(fieldName);
  if (fieldNameSplit.includes('id')) {
    visit(node, {
      NamedType(node) {
        const message = checkType(text, fieldName, node);
        if (message) {
          messages.push(message);
        }
      }
    });
  }
};

module.exports = function(ast, text) {
  const messages = [];

  visit(ast, {
    InputValueDefinition(node) {
      checkNamedType(node, text, messages);
    },
    FieldDefinition(node) {
      checkNamedType(node, text, messages);
    }
  });

  return messages;
};
