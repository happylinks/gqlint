const { visit, getLocation } = require('graphql/language');
const { camelCase } = require('lodash');

const checkField = (text, node) => {
    const camelCased = camelCase(node.name.value);
    if (camelCased !== node.name.value) {
        const message = `Property '${node.name.value}' is not camelcased.`;
        const location = getLocation(
            { body: text },
            node.name.loc.start
        );

        return {
            message,
            line: location.line,
            column: location.column,
            ruleId: 'camelcase',
            severity: 1,
        };
    }
};

module.exports = function(ast, text) {
    const messages = [];

    visit(ast, {
        FieldDefinition(node) {
            const message = checkField(text, node);
            if (message) {
                messages.push(message);
            }
        },
        Field(node) {
            const message = checkField(text, node);
            if (message) {
                messages.push(message);
            }

        }
    });

    return messages;
}
