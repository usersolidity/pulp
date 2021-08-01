const confit = require('confit');
const proxy = require('./proxy');

confit()
  .addDefault({
    IPFS_GATEWAY: process.env.IPFS_GATEWAY,
    AUTH_URL: process.env.AUTH_URL,
    PORT: 8080,
  })
  .create(async (error, config) => {
    if (error) {
      console.error('Error creating proxy environment:');
      console.error(error);
      process.exit(1);
    }

    const server = await proxy.listen(config);
    const address = server.address();
    console.log(`Reverse proxy at ${address.address}:${address.port} forwarding traffic to ${config.get('IPFS_GATEWAY')}`);
  });
