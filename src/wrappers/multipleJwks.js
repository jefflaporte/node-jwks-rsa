import debug from 'debug';

export default function(client, options) {
  const logger = debug('jwks');
  const getKeys = client.getKeys.bind(client);
  const jwksUris = options.jwksUri;

  logger('Configured multiple JWKS URIs');
  return (cb) => {
    let collected = [];
    let toCollect = jwksUris.length;
    const collect = (err, res) => {
      toCollect -= 1;
      collected = collected.concat(res);
      toCollect == 0 ? cb(null, collected) : null;
    };

    jwksUris.map(uri => {
      getKeys(collect, Object.assign(options, { jwksUri: uri }));
    });
  };
}
