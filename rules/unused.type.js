const { visit, getLocation } = require('graphql/language');

const defaultScalars = ['ID', 'String', 'Float', 'Int', 'Boolean'];

const getMessage = (text, node) => {
  const message = `Type '${node.name.value}' is never used.`;
  const location = getLocation({ body: text }, node.name.loc.start);

  return {
    message,
    line: location.line,
    column: location.column,
    ruleId: 'unused.type',
    severity: 1
  };
};

module.exports = function(ast, text) {
  const messages = [];
  const allTypes = {};
  const usedTypes = [];
  const otherTypes = {};

  visit(ast, {
    ObjectTypeDefinition(node) {
      allTypes[node.name.value] = node;
    },
    InputObjectTypeDefinition(node) {
      allTypes[node.name.value] = node;
    },
    InterfaceTypeDefinition(node) {
      allTypes[node.name.value] = node;
    },
    UnionTypeDefinition(node) {
      allTypes[node.name.value] = node;
    },
    EnumTypeDefinition(node) {
      allTypes[node.name.value] = node;
    },
    ScalarTypeDefinition(node) {
      allTypes[node.name.value] = node;
    }
  });

  visit(ast, {
    NamedType(node) {
      const typeName = node.name.value;
      if (Object.keys(allTypes).includes(typeName)) {
        usedTypes.push(typeName);
      } else {
        otherTypes[typeName] = {};
      }
    }
  });

  const unusedTypes = Object.keys(allTypes).filter(
    field => !usedTypes.includes(field)
  );

  unusedTypes.map(unusedType => {
    const message = getMessage(text, allTypes[unusedType]);
    messages.push(message);
  });

  // Remove scalars from other types to see if we have broken references.
  // const cleanOtherTypes = otherTypes.filter(otherType => !defaultScalars.includes(otherType)));

  // cleanOtherTypes.map(otherType => {
  //     const message = getOtherMessage(text, allTypes[unusedType]);
  //     messages.push(message);
  // });

  return messages;
};
