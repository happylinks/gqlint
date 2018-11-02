const gqLint = require('../../lib/gqlint');

const options = {
  rules: {
    camelcase: 'warn'
  }
};

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
    `
};

describe('Rule: camelCase', () => {
  test('ObjectType Field', () => {
    const results = gqLint(invalid.objectTypeField, '', options);
    expect(results[0].warningCount).toBe(1);
    expect(results[0].messages[0].message).toBe(
      `Property 'Name' is not camelcased.`
    );
  });
  test('OperationField', () => {
    const results = gqLint(invalid.operationField, '', options);
    expect(results[0].warningCount).toBe(2);
    expect(results[0].messages[0].message).toBe(
      `Property 'User' is not camelcased.`
    );
    expect(results[0].messages[1].message).toBe(
      `Property 'Id' is not camelcased.`
    );
  });
});
