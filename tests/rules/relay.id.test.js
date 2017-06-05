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
    `
};

describe('Rule: Relay ID', () => {
  test('UUID', () => {
    const results = gqLint(invalid.uuid, '', {});
    expect(results[0].warningCount).toBe(1);
    expect(results[0].messages[0].message).toBe(
      `Field 'id' uses UUID. Please use 'ID' instead.`
    );
  });
  test('GlobalID', () => {
    const results = gqLint(invalid.globalId, '', {});
    expect(results[0].warningCount).toBe(1);
    expect(results[0].messages[0].message).toBe(
      `Field 'id' uses GlobalID. Please use 'ID' instead.`
    );
  });
  test('String', () => {
    const results = gqLint(invalid.string, '', {});
    expect(results[0].warningCount).toBe(1);
    expect(results[0].messages[0].message).toBe(
      `Field 'id' uses String. Please use 'ID' instead.`
    );
  });
  test('StrangeId', () => {
    const results = gqLint(invalid.strangeId, '', {});
    expect(results[0].warningCount).toBe(1);
    expect(results[0].messages[0].message).toBe(
      `Field 'id' uses StrangeIdType. Please use 'ID' instead.`
    );
  });
  test('Custom fieldName', () => {
    const results = gqLint(invalid.customFieldName, '', {});
    expect(results[0].warningCount).toBe(1);
    expect(results[0].messages[0].message).toBe(
      `Field 'relatedId' uses String. Please use 'ID' instead.`
    );
  });
});
