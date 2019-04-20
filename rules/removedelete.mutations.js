const { visit, getLocation } = require('graphql/language');

const isDeleteRemoveRegex = /^(remove|delete)(.*)$/;
const isDeleteRemoveMutation = name => isDeleteRemoveRegex.test(name);

const isRelationRegex = /^(remove|delete)(.*)From(.*)$/;
const isRelation = name => isRelationRegex.test(name);

// Correct
// const relation = /^remove(.*)From(.*)$/;
// const single = /^delete((?!From).)*$/;

// Wrong
const relation = /^delete(.*)From(.*)$/;
const isWrongRelation = name => relation.test(name);
const single = /^remove((?!From).)*$/;
const isWrongSingle = name => single.test(name);

const getMessage = (text, message, start) => {
  const location = getLocation({ body: text }, start);

  return {
    message,
    line: location.line,
    column: location.column,
    ruleId: 'removedelete.mutations',
    severity: 1
  };
};

const getSingleMessage = (text, name, suggestion, start) => {
  const message = `Mutation '${name}' uses 'remove' for a single entity. It's better to use '${suggestion}'.`;
  return getMessage(text, message, start);
};

const getRelationMessage = (text, name, suggestion, start) => {
  const message = `Mutation '${name}' uses 'delete' for a mutation on a relationship. It's better to use '${suggestion}'.`;
  return getMessage(text, message, start);
};

const checkWrongName = (text, node, messages, name) => {
  if (isDeleteRemoveMutation(name)) {
    if (isRelation(name)) {
      if (isWrongRelation(name)) {
        const suggestion = name.replace('delete', 'remove');
        messages.push(
          getRelationMessage(text, name, suggestion, node.name.loc.start)
        );
      }
    } else {
      if (isWrongSingle(name)) {
        const suggestion = name.replace('remove', 'delete');
        messages.push(
          getSingleMessage(text, name, suggestion, node.name.loc.start)
        );
      }
    }
  }
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
          checkWrongName(text, node, messages, name);
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
          checkWrongName(text, node, messages, name);
        }
      });
    }
  });

  return messages;
};
