const { visit, getLocation } = require('graphql/language');
const pluralize = require('pluralize');

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
                    const pluralizedName = pluralize(name);

                    if (name === pluralizedName) {
                        const message = `Mutation '${name}' is plural. It's better to use singular mutations.`;
                        const location = getLocation(
                            { body: text },
                            node.name.loc.start
                        );

                        messages.push({
                            message,
                            line: location.line,
                            column: location.column,
                            ruleId: 'singular.mutations',
                            severity: 1,
                        });
                    }
                }
            });
        }
    });

    return messages;
}
