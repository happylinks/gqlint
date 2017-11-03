const gqLint = require('../../lib/gqlint');

const invalid = {
  schema1: `
        type SuperHero {
           id: ID!
           name: String!
        }

        type User {
            id: ID!
            name: String!
        }

        type Group {
            users: [User]
        }

        type GraphQLQuery {
            group(id: ID!): Group
        }

        schema {
            query: GraphQLQuery
            mutation: GraphQLMutation
        }
    `,
  schema2: `
        input SuperHeroInput {
           id: ID!
           name: String!
        }

        input CreateUserInput {
            id: ID!
            name: String!
        }

        type CreateUserPayload {
            id: ID!
            name: String
        }

        type GraphQLMutation {
            createUser(input: CreateUserInput!): CreateUserPayload
        }

        schema {
            query: GraphQLQuery
            mutation: GraphQLMutation
        }
    `
};

describe('Rule: Unused types', () => {
  test('Schema 1', () => {
    const results = gqLint(invalid.schema1, '', {});
    expect(results[0].warningCount).toBe(1);
    expect(results[0].messages[0].message).toBe(
      `Type 'SuperHero' is never used.`
    );
  });
  test('Schema 2', () => {
    const results = gqLint(invalid.schema2, '', {});
    expect(results[0].warningCount).toBe(1);
    expect(results[0].messages[0].message).toBe(
      `Type 'SuperHeroInput' is never used.`
    );
  });
});
