const { visit, getLocation } = require('graphql/language');
const { difference } = require('lodash');

module.exports = function(ast, text) {
  const messages = [];

  const requiredFields = ['edges', 'pageInfo'];

  visit(ast, {
    ObjectTypeDefinition(node) {
      const typeName = node.name.value;

      if (typeName.endsWith('Connection')) {
        const fieldNames = node.fields.map(field => field.name.value);
        const missingFields = requiredFields.filter(
          requiredField => fieldNames.indexOf(requiredField) === -1
        );

        if (missingFields.length) {
          const message = `Connection '${typeName}' does not have field${missingFields.length > 1 ? 's' : ''} '${missingFields.join(', ')}'.`;
          const location = getLocation({ body: text }, node.name.loc.start);

          messages.push({
            message,
            line: location.line,
            column: location.column,
            ruleId: 'relay.connection',
            severity: 1
          });
        }
      }
    }
  });

  return messages;
};
