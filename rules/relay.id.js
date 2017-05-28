const { visit, getLocation } = require('graphql/language');

module.exports = function(ast, text) {
    const messages = [];
    const wrongIdArray = ['GlobalID', 'UUID'];

    visit(ast, {
        FieldDefinition(node) {
            const fieldName = node.name.value;

            if (fieldName.indexOf('id') !== -1) {
                // console.log(`${node.name.value} contains id`);
            }
            visit(node, {
                NamedType(node) {
                    const matchIndex = wrongIdArray.indexOf(node.name.value);
                    if (matchIndex !== -1) {
                        const message = `Field '${fieldName}' uses ${wrongIdArray[matchIndex]}. Please use 'ID' instead.`;
                        const location = getLocation(
                            { body: text },
                            node.name.loc.start
                        );

                        messages.push({
                            message,
                            line: location.line,
                            column: location.column,
                            ruleId: 'relay.id',
                            severity: 1,
                        });
                    }
                }
            });
        },
        // Last resort
        // NamedType(node) {
        //     if (['GlobalID', 'UUID'].includes(node.name.value)) {
        //         console.error('Please use ID instead of GlobalID or UUID', node.name.loc);
        //     }
        // }
    });

    return messages;
}
