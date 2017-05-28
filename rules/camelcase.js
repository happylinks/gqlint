const { visit, getLocation } = require('graphql/language');
const { camelCase } = require('lodash');

module.exports = function(ast, text) {
    const messages = [];

    visit(ast, {
        FieldDefinition(node) {
            const camelCased = camelCase(node.name.value);
            if (camelCased !== node.name.value) {
                const message = `Property '${node.name.value}' is not camelcased.`;
                const location = getLocation(
                    { body: text },
                    node.name.loc.start
                );

                messages.push({
                    message,
                    line: location.line,
                    column: location.column,
                    ruleId: 'camelcase',
                    severity: 1,
                });
            }
        }
    });

    return messages;
}
