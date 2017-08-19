const gqLint = require('../../lib/gqlint');

const valid = {
  mutationDelete: `
        mutation deleteUser($input: DeleteUserInput) {
            deleteUser(input: $input) {
                user {
                    id
                }
            }
        }
    `,
  schemaMutationDelete: `
        type GraphQLMutation {
            deleteUser(input: DeleteUserInput!): DeleteUserPayload
        }
    `,
  mutationRemove: `
        mutation removeUserFromGroup($input: RemoveUserFromGroupInput) {
            removeUserFromGroup(input: $input) {
                user {
                    id
                }
            }
        }
    `,
  schemaMutationRemove: `
        type GraphQLMutation {
            removeUserFromGroup(input: RemoveUserFromGroupInput!): RemoveUserFromGroupPayload
        }
    `
};

const invalid = {
  mutationDelete: `
        mutation removeUser($input: RemoveUserInput) {
            removeUser(input: $input) {
                user {
                    id
                }
            }
        }
    `,
  schemaMutationDelete: `
        type GraphQLMutation {
            removeUser(input: RemoveUserInput!): RemoveUserPayload
        }
    `,
  mutationRemove: `
        mutation deleteUserFromGroup($input: DeleteUserFromGroupInput) {
            deleteUserFromGroup(input: $input) {
                user {
                    id
                }
            }
        }
    `,
  schemaMutationRemove: `
        type GraphQLMutation {
            deleteUserFromGroup(input: DeleteUserFromGroupInput!): DeleteUserFromGroupPayload
        }
    `
};

describe('Rule: RemoveDelete', () => {
  describe('Valid GraphQL', () => {
    test('Delete Mutation', () => {
      const results = gqLint(valid.mutationDelete, '', {});
      expect(results[0].warningCount).toBe(0);
    });
    test('Delete Schema Mutation', () => {
      const results = gqLint(valid.schemaMutationDelete, '', {});
      expect(results[0].warningCount).toBe(0);
    });
    test('Remove Mutation', () => {
      const results = gqLint(valid.mutationRemove, '', {});
      expect(results[0].warningCount).toBe(0);
    });
    test('Remove Schema Mutation', () => {
      const results = gqLint(valid.schemaMutationRemove, '', {});
      expect(results[0].warningCount).toBe(0);
    });
  });
  describe('Invalid GraphQL', () => {
    test('Delete Mutation', () => {
      const results = gqLint(invalid.mutationDelete, '', {});
      expect(results[0].warningCount).toBe(1);
      expect(results[0].messages[0].message).toBe(
        `Mutation 'removeUser' uses 'remove' for a single entity. It's better to use 'deleteUser'.`
      );
    });
    test('Delete Schema Mutation', () => {
      const results = gqLint(invalid.schemaMutationDelete, '', {});
      expect(results[0].warningCount).toBe(1);
      expect(results[0].messages[0].message).toBe(
        `Mutation 'removeUser' uses 'remove' for a single entity. It's better to use 'deleteUser'.`
      );
    });
    test('Remove Mutation', () => {
      const results = gqLint(invalid.mutationRemove, '', {});
      expect(results[0].warningCount).toBe(1);
      expect(results[0].messages[0].message).toBe(
        `Mutation 'deleteUserFromGroup' uses 'delete' for a mutation on a relationship. It's better to use 'removeUserFromGroup'.`
      );
    });
    test('Remove Schema Mutation', () => {
      const results = gqLint(invalid.schemaMutationRemove, '', {});
      expect(results[0].warningCount).toBe(1);
      expect(results[0].messages[0].message).toBe(
        `Mutation 'deleteUserFromGroup' uses 'delete' for a mutation on a relationship. It's better to use 'removeUserFromGroup'.`
      );
    });
  });
});
