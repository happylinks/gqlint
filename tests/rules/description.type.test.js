const gqLint = require('../../lib/gqlint');

const options = {
  rules: {
    'description.type': 'warn'
  }
};

const invalid = {
  objectType: `
    type Person {
      name: String
    }
    `
};

const valid = {
  objectType: `
    "A person is a type of user with a name."
    type Person {
      name: String
    }
  `
};

describe('Rule: descriptions.type', () => {
  describe('Valid GraphQL', () => {
    test('ObjectType valid', () => {
      const results = gqLint(valid.objectType, '', options);
      expect(results[0].warningCount).toBe(0);
    });
  });
  describe('Invalid GraphQL', () => {
    test('ObjectType invalid', () => {
      const results = gqLint(invalid.objectType, '', options);
      expect(results[0].warningCount).toBe(1);
      expect(results[0].messages[0].message).toBe(
        `Type 'Person' does not have a description.`
      );
    });
  });
});
