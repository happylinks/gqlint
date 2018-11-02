const gqLint = require('../../lib/gqlint');

const options = {
  rules: {
    'relay.id': 'warn'
  }
};

const invalid = {
  uuid: `
        type User {
            id: UUID!
        }
    `,
  globalId: `
        type User {
            id: GlobalID!
        }
    `,
  string: `
        type User {
            id: String!
        }
    `,
  strangeId: `
        type User {
            id: StrangeIdType!
        }
    `,
  customFieldName: `
        type User {
            relatedId: String!
        }
    `,
  input: `
        input UserInput {
            id: GlobalResource!
        }
    `
};

describe('Rule: Relay ID', () => {
  test('UUID', () => {
    const results = gqLint(invalid.uuid, '', options);
    expect(results[0].warningCount).toBe(1);
    expect(results[0].messages[0].message).toBe(
      `Field 'id' in Type 'User' uses 'UUID'. Please use 'ID' instead.`
    );
  });
  test('GlobalID', () => {
    const results = gqLint(invalid.globalId, '', options);
    expect(results[0].warningCount).toBe(1);
    expect(results[0].messages[0].message).toBe(
      `Field 'id' in Type 'User' uses 'GlobalID'. Please use 'ID' instead.`
    );
  });
  test('String', () => {
    const results = gqLint(invalid.string, '', options);
    expect(results[0].warningCount).toBe(1);
    expect(results[0].messages[0].message).toBe(
      `Field 'id' in Type 'User' uses 'String'. Please use 'ID' instead.`
    );
  });
  test('StrangeId', () => {
    const results = gqLint(invalid.strangeId, '', options);
    expect(results[0].warningCount).toBe(1);
    expect(results[0].messages[0].message).toBe(
      `Field 'id' in Type 'User' uses 'StrangeIdType'. Please use 'ID' instead.`
    );
  });
  test('Custom fieldName', () => {
    const results = gqLint(invalid.customFieldName, '', options);
    expect(results[0].warningCount).toBe(1);
    expect(results[0].messages[0].message).toBe(
      `Field 'relatedId' in Type 'User' uses 'String'. Please use 'ID' instead.`
    );
  });
  test('Input', () => {
    const results = gqLint(invalid.input, '', options);
    expect(results[0].warningCount).toBe(1);
    expect(results[0].messages[0].message).toBe(
      `Field 'id' in Type 'UserInput' uses 'GlobalResource'. Please use 'ID' instead.`
    );
  });
});
