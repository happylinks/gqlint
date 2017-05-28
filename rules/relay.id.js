const { visit, getLocation } = require('graphql/language');

const checkType = (text, fieldName, node) => {
    if (node.name.value !== 'ID') {
        const message = `Field '${fieldName}' uses ${node.name.value}. Please use 'ID' instead.`;
        const location = getLocation(
            { body: text },
            node.name.loc.start
        );

        return {
            message,
            line: location.line,
            column: location.column,
            ruleId: 'relay.id',
            severity: 1,
        };
    }
};

module.exports = function(ast, text) {
    const messages = [];

    visit(ast, {
        FieldDefinition(node) {
            const fieldName = node.name.value;
            // Split camelcase and turn into array.
            const fieldNameSplit = fieldName.replace(/([a-z](?=[A-Z]))/g, '$1 ').split(' ').map(value => value.toLowerCase());

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
        },
    });

    return messages;
}
