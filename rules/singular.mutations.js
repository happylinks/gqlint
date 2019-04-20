const { visit, getLocation } = require('graphql/language');
const pluralize = require('pluralize');

const isPluralized = name => {
  const pluralized = pluralize(name);
  return name === pluralized;
};

const getMessage = (text, name, start) => {
  const message = `Mutation '${name}' is plural. It's better to use singular mutations.`;
  const location = getLocation({ body: text }, start);

  return {
    message,
    line: location.line,
    column: location.column,
    ruleId: 'singular.mutations',
    severity: 1
  };
};

function getMutationNames(ast) {
  const mutationNames = [];

  visit(ast, {
    ObjectTypeExtension(node) {
      if (node.name.value !== 'Mutation') {
        return;
      }
      visit(node, {
        FieldDefinition(node) {
          mutationNames.push(node.type.name.value);
        }
      });
    },
    ObjectTypeDefinition(node) {
      if (node.name.value === 'Mutation') {
        mutationNames.push(node.name.value);
      }
    }
  });
  return mutationNames;
}

module.exports = function(ast, text) {
  const messages = [];

  const mutationNames = getMutationNames(ast);

  visit(ast, {
    ObjectTypeDefinition(node) {
      if (mutationNames.indexOf(node.name.value) < 0) {
        return;
      }

      visit(node, {
        FieldDefinition(node) {
          const name = node.name.value;

          if (isPluralized(name)) {
            messages.push(getMessage(text, name, node.name.loc.start));
          }
        }
      });
    },
    OperationDefinition(node) {
      if (node.operation !== 'mutation') {
        return;
      }

      node.selectionSet.selections.forEach(selection => {
        if (selection.kind === 'Field') {
          const name = selection.name.value;
          if (isPluralized(name)) {
            messages.push(getMessage(text, name, selection.name.loc.start));
          }
        }
      });
    }
  });

  return messages;
};
