const { visit, getLocation } = require('graphql/language');

const getMessage = (text, node, fieldName, typeName) => {
  const message = `Field '${fieldName}' in Type '${typeName}' uses '${node.name
    .value}'. Please use 'ID' instead.`;
  const location = getLocation({ body: text }, node.name.loc.start);

  return {
    message,
    line: location.line,
    column: location.column,
    ruleId: 'relay.id',
    severity: 1
  };
};

// Check if type has a valid id type.
const isValidType = (text, fieldName, node) => {
  return !(node.name.value !== 'ID' && fieldName !== 'clientMutationId');
};

// Split camelcase and turn into array.
const splitFieldName = fieldName =>
  fieldName
    .replace(/([a-z](?=[A-Z]))/g, '$1 ')
    .split(' ')
    .map(value => value.toLowerCase());

// Walk through this field until you find the NamedType, and check if that type is valid.
const checkNamedType = (node, text, typeName, messages) => {
  const fieldName = node.name.value;
  const fieldNameSplit = splitFieldName(fieldName);
  if (fieldNameSplit.includes('id')) {
    visit(node, {
      NamedType(node) {
        const valid = isValidType(text, fieldName, node);
        if (!valid) {
          const message = getMessage(text, node, fieldName, typeName);
          messages.push(message);
        }
      }
    });
  }
};

const checkTypeDefinition = (node, text, messages) => {
  const typeName = node.name.value;
  visit(node, {
    FieldDefinition(node) {
      checkNamedType(node, text, typeName, messages);
    },
    InputValueDefinition(node) {
      checkNamedType(node, text, typeName, messages);
    }
  });
};

module.exports = function(ast, text) {
  const messages = [];

  visit(ast, {
    ObjectTypeDefinition(node) {
      checkTypeDefinition(node, text, messages);
    },
    InputObjectTypeDefinition(node) {
      checkTypeDefinition(node, text, messages);
    }
  });

  return messages;
};
