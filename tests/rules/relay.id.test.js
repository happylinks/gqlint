const gqLint = require('../../lib/gqlint');

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
    const results = gqLint(invalid.uuid, '', {});
    expect(results[0].warningCount).toBe(1);
    expect(results[0].messages[0].message).toBe(
      `Field 'id' in Type 'User' uses 'UUID'. Please use 'ID' instead.`
    );
  });
  test('GlobalID', () => {
    const results = gqLint(invalid.globalId, '', {});
    expect(results[0].warningCount).toBe(1);
    expect(results[0].messages[0].message).toBe(
      `Field 'id' in Type 'User' uses 'GlobalID'. Please use 'ID' instead.`
    );
  });
  test('String', () => {
    const results = gqLint(invalid.string, '', {});
    expect(results[0].warningCount).toBe(1);
    expect(results[0].messages[0].message).toBe(
      `Field 'id' in Type 'User' uses 'String'. Please use 'ID' instead.`
    );
  });
  test('StrangeId', () => {
    const results = gqLint(invalid.strangeId, '', {});
    expect(results[0].warningCount).toBe(1);
    expect(results[0].messages[0].message).toBe(
      `Field 'id' in Type 'User' uses 'StrangeIdType'. Please use 'ID' instead.`
    );
  });
  test('Custom fieldName', () => {
    const results = gqLint(invalid.customFieldName, '', {});
    expect(results[0].warningCount).toBe(1);
    expect(results[0].messages[0].message).toBe(
      `Field 'relatedId' in Type 'User' uses 'String'. Please use 'ID' instead.`
    );
  });
  test('Input', () => {
    const results = gqLint(invalid.input, '', {});
    expect(results[0].warningCount).toBe(1);
    expect(results[0].messages[0].message).toBe(
      `Field 'id' in Type 'UserInput' uses 'GlobalResource'. Please use 'ID' instead.`
    );
  });
});
