const gqLint = require('../../lib/gqlint');

const options = {
  rules: {
    'relay.connection': 'warn'
  }
};

const invalid = {
  missingBoth: `
        type ShipConnection {
            empty: Boolean
        }
    `,
  missingEdges: `
        type ShipConnection {
            pageInfo: PageInfo!
        }
    `,
  missingPageInfo: `
        type ShipConnection {
            edges: [ShipEdge]
        }
    `
};

const valid = {
  shipConnection: `
        type ShipConnection {
            edges: [ShipEdge]
            pageInfo: PageInfo!
        }
    `
};

describe('Rule: Relay Connection', () => {
  describe('Invalid GraphQL', () => {
    test(`Has 'edges' and 'pageInfo' field`, () => {
      const results = gqLint(invalid.missingBoth, '', options);
      expect(results[0].warningCount).toBe(1);
      expect(results[0].messages[0].message).toBe(
        `Connection 'ShipConnection' does not have fields 'edges, pageInfo'.`
      );
    });
    test(`Has 'edges' field`, () => {
      const results = gqLint(invalid.missingEdges, '', options);
      expect(results[0].warningCount).toBe(1);
      expect(results[0].messages[0].message).toBe(
        `Connection 'ShipConnection' does not have field 'edges'.`
      );
    });
    test(`Has 'pageInfo' field`, () => {
      const results = gqLint(invalid.missingPageInfo, '', options);
      expect(results[0].warningCount).toBe(1);
      expect(results[0].messages[0].message).toBe(
        `Connection 'ShipConnection' does not have field 'pageInfo'.`
      );
    });
  });
  describe('Valid GraphQL', () => {
    test('Correct Connection Type', () => {
      const results = gqLint(valid.shipConnection, '', options);
      expect(results[0].warningCount).toBe(0);
    });
  });
});
