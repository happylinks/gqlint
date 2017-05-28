const gqLint = require('../../lib/gqlint');

const invalid = {
    objectTypeField: `
        type User {
            id: ID!
            Name: String!
        }
    `,
    operationField: `
        query users {
            User {
                Id
            }
        }
    `,
};

describe('Rule: camelCase', () => {
    test('ObjectType Field', () => {
        const results = gqLint(invalid.objectTypeField, '', {});
        expect(results[0].warningCount).toBe(1);
        expect(results[0].messages[0].message).toBe(`Property 'Name' is not camelcased.`);
    });
    test('OperationField', () => {
        const results = gqLint(invalid.operationField, '', {});
        expect(results[0].warningCount).toBe(2);
        expect(results[0].messages[0].message).toBe(`Property 'User' is not camelcased.`);
        expect(results[0].messages[1].message).toBe(`Property 'Id' is not camelcased.`);
    });

});
