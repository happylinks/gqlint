const gqLint = require('../../lib/gqlint');

const options = {
  rules: {
    'singular.mutations': 'warn'
  }
};

const valid = {
  mutation: `
        mutation createUser($input: CreateUserInput) {
            createUser(input: $input) {
                user {
                    id
                }
            }
        }
    `,
  schemaMutation: `
        type GraphQLMutation {
            createUser(input: CreateUserInput!): CreateUserPayload
        }
    `,
  query: `
        query user($id: ID) {
            user(id: $id) {
                id
            }
        }
    `,
  type: `
        type TestType {
            id: ID
        }
    `,
  inlineFragment: `
        mutation createUser($input: CreateUserInput) {
            ... on Human {
                name
            }
            createUser(input: $input) {
                user {
                    id
                }
            }
        }
    `
};

const invalid = {
  mutation: `
        mutation createUsers($input: CreateUsersInput) {
            createUsers(input: $input) {
                users {
                    edges {
                        node {
                            id
                        }
                    }
                }
            }
        }
    `,
  schemaMutation: `
        type GraphQLMutation {
            createUsers(input: CreateUsersInput!): CreateUsersPayload
        }
    `
};

describe('Rule: SingularMutations', () => {
  describe('Valid GraphQL', () => {
    test('Singular Mutation', () => {
      const results = gqLint(valid.mutation, '', options);
      expect(results[0].warningCount).toBe(0);
    });
    test('Singular Schema Mutation', () => {
      const results = gqLint(valid.schemaMutation, '', options);
      expect(results[0].warningCount).toBe(0);
    });
    test('Query Mutation', () => {
      const results = gqLint(valid.query, '', options);
      expect(results[0].warningCount).toBe(0);
    });
    test('Type Definition', () => {
      const results = gqLint(valid.type, '', options);
      expect(results[0].warningCount).toBe(0);
    });
    test('Inline Fragment', () => {
      const results = gqLint(valid.inlineFragment, '', options);
      expect(results[0].warningCount).toBe(0);
    });
  });
  describe('Invalid GraphQL', () => {
    test('Pluralized Mutation', () => {
      const results = gqLint(invalid.mutation, '', options);
      expect(results[0].warningCount).toBe(1);
      expect(results[0].messages[0].message).toBe(
        `Mutation 'createUsers' is plural. It's better to use singular mutations.`
      );
    });
    test('Pluralized Schema Mutation', () => {
      const results = gqLint(invalid.schemaMutation, '', options);
      expect(results[0].warningCount).toBe(1);
      expect(results[0].messages[0].message).toBe(
        `Mutation 'createUsers' is plural. It's better to use singular mutations.`
      );
    });
  });
});
