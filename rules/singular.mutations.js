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

module.exports = function(ast, text) {
  const messages = [];

  visit(ast, {
    ObjectTypeDefinition(node) {
      if (node.name.value !== 'GraphQLMutation') {
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
