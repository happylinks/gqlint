const gqLint = require('../../lib/gqlint');

const options = {
  rules: {
    'description.field': 'warn'
  }
};

const invalid = {
  fieldType: `
    type Person {
      name: String
    }
    `
};

const valid = {
  fieldType: `
    type Person {
      "A name is an identifier for a person."
      name: String
    }
  `
};

describe('Rule: descriptions.field', () => {
  describe('Valid GraphQL', () => {
    test('Field valid', () => {
      const results = gqLint(valid.fieldType, '', options);
      expect(results[0].warningCount).toBe(0);
    });
  });
  describe('Invalid GraphQL', () => {
    test('Field invalid', () => {
      const results = gqLint(invalid.fieldType, '', options);
      expect(results[0].warningCount).toBe(1);
      expect(results[0].messages[0].message).toBe(
        `Field 'name' does not have a description.`
      );
    });
  });
});
