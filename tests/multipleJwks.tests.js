import nock from 'nock';
import { expect } from 'chai';

import { x5cSingle, x5cSingle2 } from './keys';
import { JwksClient } from '../src/JwksClient';

describe('JwksClient (multipleJwks)', () => {
  const jwksHost1 = 'http://my-authz-server1';
  const jwksHost2 = 'http://my-authz-server2';

  beforeEach(() => {
    nock.cleanAll();
  });

  describe('#getSigningKey', () => {
    describe('when the client is configured with multipleJwks', () => {
      let client;

      before((done) => {
        client = new JwksClient({
          cache: true,
          multipleJwks: true,
          jwksUri: [
            `${jwksHost1}/.well-known/jwks.json`,
            `${jwksHost2}/.well-known/jwks.json`
          ]
        });

        done();
      });

      it('should fetch a key from host 1', (done) => {
        nock(jwksHost1)
          .get('/.well-known/jwks.json')
          .reply(200, x5cSingle);
        nock(jwksHost2)
          .get('/.well-known/jwks.json')
          .reply(200, x5cSingle2);

        client.getSigningKey('NkFCNEE1NDFDNTQ5RTQ5OTE1QzRBMjYyMzY0NEJCQTJBMjJBQkZCMA', (err, key) => {
          expect(key.kid).to.equal('NkFCNEE1NDFDNTQ5RTQ5OTE1QzRBMjYyMzY0NEJCQTJBMjJBQkZCMA');
          done();
        });
      });

      it('should fetch a key from host 2', (done) => {
        nock(jwksHost1)
          .get('/.well-known/jwks.json')
          .reply(200, x5cSingle);
        nock(jwksHost2)
          .get('/.well-known/jwks.json')
          .reply(200, x5cSingle2);

        client.getSigningKey('RkI5MjI5OUY5ODc1N0Q4QzM0OUYzNkVGMTJDOUEzQkFCOTU3NjE2Rg', (err, key) => {
          expect(key.kid).to.equal('RkI5MjI5OUY5ODc1N0Q4QzM0OUYzNkVGMTJDOUEzQkFCOTU3NjE2Rg');
          done();
        });
      });
    });
  });
});
