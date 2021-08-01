const httpProxy = require('http-proxy'),
  http = require('http'),
  jwt = require('jsonwebtoken'),
  jwksClient = require('jwks-rsa');

const jwks_client = jwksClient({
  jwksUri: `https://${config.get('AUTH_URL')}/.well-known/jwks.json`
});

const getJwks = (header, callback) => {
  jwks_client.getSigningKey(header.kid, function (err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

const jwt_options = {
  algorithm: 'RS256',
  audience: 'ipfs-client',
  issuer: config.get('AUTH_URL'), //TODO: parameterize
  // expiresIn: '12h', TODO: do we want this?
}

const error = (res, code, err) => {
  console.error("Proxy error: ", err.response ? err.response.data : err);
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    'Pulp Error': err?.response?.data?.message || err?.message
  }));
};

exports.listen = async (config) => {
  const port = config.get('PORT');

  // proxy for forwarding requests
  const proxy = httpProxy.createProxyServer({
    secure: false, // we'll put this behind an https terminating load balancer
    target: config.get('IPFS_GATEWAY'),
    agent: new http.Agent({ keepAlive: true }),
  }).on('error', function (err, req, res) {
    return error(res, 500, err);
  });


  // server for listening
  const server = http.createServer(async (req, res) => {
    console.log(`request to ${req.method.toUpperCase()} ${req.url}`);

    let auth_header = req.headers['Authorization'];

    // if there's no token, return 401
    if (!auth_header) {
      return error(res, 401, new Error('Please provide authentication token'));
    }

    // if the auth_header isn't properly formatted, return 403
    if (!auth_header.startsWith('Bearer ')) {
      return error(res, 403, err);
    }

    const token = auth_header.split('Bearer ')[1];

    try {
      authorized = await jwt.verify(token, getJwks, jwt_options);
      console.log('authorized:');
      console.log(authorized);
    } catch (err) {
      return error(res, 403, err);
    }

    if (authorized) {
      return proxy.web(req, res);
    } else {
      return error(res, 403, err);
    }
  });

  return server.listen(port);
};
