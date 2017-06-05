const gqLint = require('../../lib/gqlint');

const valid = {
    type: `
        type User {
            id: ID!
            name: String
        }
    `,
};

const invalid = {
    type: `
        type User {
            id: ID!
            userName: String!
        }
    `,
};

describe('Rule: FieldnameTypename', () => {
    describe('Valid GraphQL', () => {
        test('Type', () => {
            const results = gqLint(valid.type, '', {});
            expect(results[0].warningCount).toBe(0);
        });
        // test('OperationField', () => {
        //     const results = gqLint(invalid.operationField, '', {});
        //     expect(results[0].warningCount).toBe(2);
        //     expect(results[0].messages[0].message).toBe(`Property 'User' is not camelcased.`);
        //     expect(results[0].messages[1].message).toBe(`Property 'Id' is not camelcased.`);
        // });
    });
    describe('Invalid GraphQL', () => {
        test('Type', () => {
            const results = gqLint(invalid.type, '', {});
            expect(results[0].warningCount).toBe(1);
            expect(results[0].messages[0].message).toBe(`Type 'user' has a property called 'userName'. Don't use type-names in property-names. Maybe use 'name' instead?`);
        });
        // test('OperationField', () => {
        //     const results = gqLint(invalid.operationField, '', {});
        //     expect(results[0].warningCount).toBe(2);
        //     expect(results[0].messages[0].message).toBe(`Property 'User' is not camelcased.`);
        //     expect(results[0].messages[1].message).toBe(`Property 'Id' is not camelcased.`);
        // });

    });
});
