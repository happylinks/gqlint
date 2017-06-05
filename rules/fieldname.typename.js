const { visit, getLocation } = require('graphql/language');
const { camelCase } = require('lodash');

module.exports = function(ast, text) {
  const messages = [];

  visit(ast, {
    ObjectTypeDefinition(node) {
      const typeName = node.name.value.toLowerCase();
      const fields = node.fields;

      fields.forEach(field => {
        const fieldName = field.name.value;
        if (fieldName.indexOf(typeName) !== -1) {
          const suggestion = camelCase(fieldName.replace(typeName, ''));

          const message = `Type '${typeName}' has a property called '${fieldName}'. Don't use type-names in property-names. Maybe use '${suggestion}' instead?`;
          const location = getLocation({ body: text }, field.name.loc.start);

          messages.push({
            message,
            line: location.line,
            column: location.column,
            ruleId: 'fieldname.typename',
            severity: 1
          });
        }
      });
    }
  });

  return messages;
};
